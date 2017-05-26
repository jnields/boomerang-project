import {
    LOG_IN,
    LOG_OUT,
    RESET_PASSWORD,
    RESET_AUTH,
} from '../actions/types';
import {
  PENDING,
  COMPLETE,
  ERROR,
  UNSENT,
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
        user: null,
      };
    case COMPLETE:
      return {
        ...state,
        loggingIn: false,
        logInFailed: false,
        logInUnsent: false,
        user: action.result,
      };
    case ERROR:
      return {
        ...state,
        loggingIn: false,
        logInFailed: true,
        logInUnsent: false,
        user: null,
      };
    case UNSENT:
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
    case RESET_PASSWORD:
      return logIn(state, action);
    case LOG_OUT:
      return initialState;
    case RESET_AUTH:
      return {
        ...state,
        loggingIn: false,
        logInFailed: false,
        logInUnsent: false,
      };
    default: break;
  }
  return state;
}
