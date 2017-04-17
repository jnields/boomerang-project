import {
    LOG_IN,
    LOG_OUT,
} from '../actions/types';
import {
  PENDING,
  COMPLETE,
  ERROR,
} from '../actions/xhr-statuses';

const initialState = {
  loggingIn: false,
  logInFailed: false,
  logInUnsent: false,
  user: null,
};

function logIn(state, action) {
  switch (action.status) {
    case PENDING:
      return {
        ...state,
        loggingIn: true,
        logInFailed: false,
        logInUnsent: false,
        user: null,
      };
    case COMPLETE:
      switch (action.response.statusCode) {
        case 200:
        case 304: {
          return {
            ...state,
            loggingIn: false,
            logInFailed: false,
            logInUnsent: false,
            user: action.result,
          };
        }
        case 422:
        case 500:
        default:
          return {
            ...state,
            loggingIn: false,
            logInFailed: true,
            logInUnsent: false,
            user: null,
          };
      }
    case ERROR:
      return {
        ...state,
        loggingIn: false,
        logInFailed: false,
        logInUnsent: true,
        user: null,
      };
    default: throw new TypeError('unhandled type');
  }
}

export default function (state = initialState, action) {
  if (action.response && action.response.statusCode === 401) {
    return initialState;
  }
  switch (action.type) {
    case LOG_IN:
      return logIn(state, action);
    case LOG_OUT:
      return initialState;
    default: break;
  }
  return state;
}
