import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    XHR_ERROR,
    LOG_OUT
} from "../actions/types";
import { remove, load } from "react-cookie";

let user = load("USER"),
    authorized = (
        user !== void 0
        && load("SESSION_ID") !== void 0
    ),
    schoolId = load("SCHOOL_ID");

const initialState = {
    authorizing: false,
    user,
    authorized,
    schoolId
};

function removeAuth() {
    remove("USER");
    remove("SCHOOL_ID");
    remove("SESSION_ID");
}

export default function(state = initialState, action) {
    switch (action.type) {
    case LOG_OUT:
        removeAuth();
        return {
            authorized: false,
            authorizing: false,
            schoolId: void 0,
            user: void 0
        };
    case XHR_ERROR:
        if (action.parentType === AUTHORIZE) {
            removeAuth();
            return {
                authorizing: false,
                authorized: false,
                user: void 0,
                schoolId: void 0
            };
        }
        break;
    case AUTHORIZE:
        removeAuth();
        return {
            authorizing: true,
            user: void 0,
            authorized: false,
            schoolId: void 0
        };
    case AUTHORIZE_SUCCESS:
        return {
            authorizing: false,
            user: action.result,
            schoolId: action.schoolId,
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
