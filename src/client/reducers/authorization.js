import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    XHR_ERROR,
    LOG_OUT,
    LOG_OUT_SUCCESS,
    LOG_OUT_ERROR
} from "../actions/types";

export default function(state, action) {
    if (action.response && action.response.statusCode === 401) {
        return {
            authorized: false,
            authorizing: false,
            loggingOut: false,
            logOutFail: false,
            invalidAttempt: false,
            school: null,
            user: null
        };
    }
    switch (action.type) {
    case LOG_OUT:
        return {
            ... state,
            loggingOut: true,
            logOutFail: false
        };
    case LOG_OUT_ERROR:
        return {
            ... state,
            loggingOut: false,
            logOutFail: true
        };
    case LOG_OUT_SUCCESS:
        return {
            authorized: false,
            authorizing: false,
            loggingOut: false,
            logOutFail: false,
            invalidAttempt: false,
            user: null,
            school: null
        };
    case XHR_ERROR:
        switch(action.parentType) {
        case AUTHORIZE:
            return {
                ... state,
                authorizing: false,
                authorized: false,
                loggingOut: false,
                invalidAttempt: false
            };
        case LOG_OUT:
            return {
                ... state,
                loggingOut: false,
                logOutFail: true
            };
        }
        break;
    case AUTHORIZE:
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
