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
let user = load("USER", true),
    school = load("SCHOOL", true);
try {
    user = JSON.parse(user);
    if (typeof(user) !== "object") user = null;
} catch(e) {
    user = null;
}
try {
    school = JSON.parse(school);
    if (typeof(school) !== "object") school = null;
} catch(e) {
    school = null;
}

let sessionId = load("SID", true),
    authorized = (
        user != null
        && sessionId !== void 0
    );

if (user != null)
    user = normalize(user, schemas.user).result;
if (school != null)
    school = normalize(school, schemas.school).result;

const initialState = {
    authorizing: false,
    user,
    invalidAttempt: false,
    authorized,
    school
};

function removeAuth() {
    remove("SID");
    remove("SCHOOL");
    remove("USER");
}

export default function(state = initialState, action) {
    if (action.response && action.response.statusCode === 401) {
        removeAuth();
        return {
            authorized: false,
            authorizing: false,
            invalidAttempt: false,
            school: void 0,
            user: void 0
        };
    }
    switch (action.type) {
    case LOG_OUT:
        removeAuth();
        return {
            authorized: false,
            authorizing: false,
            invalidAttempt: false,
            school: void 0,
            user: void 0
        };
    case XHR_ERROR:
        if (action.parentType === AUTHORIZE) {
            removeAuth();
            return {
                authorizing: false,
                authorized: false,
                invalidAttempt: false,
                user: void 0,
                school: void 0
            };
        }
        break;
    case AUTHORIZE:
        removeAuth();
        return {
            authorizing: true,
            user: void 0,
            authorized: false,
            invalidAttempt: false,
            school: void 0
        };
    case AUTHORIZE_SUCCESS:
        return {
            authorizing: false,
            invalidAttempt: false,
            school: action.school,
            user: action.user,
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
            invalidAttempt: true,
            authorized: false,
            error
        };
    }}
    return state;
}
