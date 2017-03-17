import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    FETCH_ERROR,
    LOG_OUT
} from "../actions/types";
import { remove, load } from "react-cookie";

let user = load("USER"),
    authorized = user !== void 0
        && load("SESSION_ID") !== void 0;

const initialState = {
    authorizing: false,
    user,
    authorized
};

function removeAuth() {
    remove("USER");
    remove("SESSION_ID");
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
    case FETCH_ERROR:
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
