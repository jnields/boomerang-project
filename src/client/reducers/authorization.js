import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    XHR_ERROR,
    LOG_OUT
} from "../actions/types";
import { remove, load } from "react-cookie";
import { normalize } from "normalizr";
import * as schemas from "../helpers/schema";
let user = load("USER"),
    sessionId = load("SID", true),
    authorized = (
        user !== void 0
        && sessionId !== void 0
    ),
    schoolId = parseInt(load("SCHOOL_ID"));

if (user !== void 0)
    user = normalize(user, schemas.user).result;

const initialState = {
    authorizing: false,
    user,
    authorized,
    schoolId
};

function removeAuth() {
    remove("SID");
    remove("SCHOOL_ID");
    remove("USER");
}

export default function(state = initialState, action) {
    if (action.response && action.response.statusCode === 401) {
        removeAuth();
        return {
            authorized: false,
            authorizing: false,
            schoolId: void 0,
            user: void 0
        };
    }
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
