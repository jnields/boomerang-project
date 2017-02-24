import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    XHR_ERROR,
    LOG_OUT
} from "../actions/types";
import { getCookie, deleteCookie } from "../helpers";

let user = localStorage.getItem("user"),
    authorized = getCookie("SESSION_ID") ? true : false;

let ok;
try {
    user = JSON.parse(user);
    if (user && user.tier) ok = true;
    else ok = false;
} catch (e) {
    ok = false;
}

if (!ok) {
    user = null;
    authorized = false;
    removeAuth();
}

const initialState = {
    authorizing: false,
    user,
    authorized
};

function removeAuth() {
    localStorage.setItem("user", "");
    deleteCookie("SESSION_ID");
}

export default function(state = initialState, action) {
    switch (action.type) {
    case LOG_OUT:
        removeAuth();
        return {
            authorized: false,
            authorizing: false,
            user: null
        };
    case XHR_ERROR:
        if (action.parentType === AUTHORIZE) {
            removeAuth();
            return {
                authorizing: false,
                authorized: false,
                user: null
            };
        }
        break;
    case AUTHORIZE:
        removeAuth();
        return {
            authorizing: true,
            user: null,
            authorized: false
        };
    case AUTHORIZE_SUCCESS:
        localStorage.setItem(
            "user",
            action.response.json()
        );
        return {
            authorizing: false,
            user: action.result,
            authorized: true
        };
    case AUTHORIZE_ERROR: {
        let error;
        switch(action.response.status) {
        case 422:
            error = "Invalid username or password.";
            break;
        case 500:
            error = "Whoops, something went wrong.";
            break;
        }
        removeAuth();
        return {
            authorizing: false,
            user: null,
            authorized: false,
            error
        };
    }}
    return state;
}
