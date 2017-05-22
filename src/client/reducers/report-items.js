import { LOAD_REPORT, LEAVE_REPORT } from '../actions/types';
import { PENDING, COMPLETE, ERROR, UNSENT } from '../actions/xhr-statuses';

const initialState = {
  loading: false,
  items: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_REPORT:
      switch (action.status) {
        case PENDING:
          return { ...state, items: [], loading: true, error: null };
        case COMPLETE:
          return { loading: false, items: action.items, error: null };
        case ERROR:
        case UNSENT:
          return { loading: false, items: [], error: action.error };
        default: throw new TypeError(`Unhandled in switch: ${action.status}`);
      }
    case LEAVE_REPORT:
      return { loading: false, items: [], error: null };
    default: return state;
  }
}
