import { QUERY_SCHOOLS } from '../actions/types';
import { COMPLETE, PENDING, ERROR } from '../actions/xhr-statuses';

const initialState = {
  items: [],
  query: {
    $offset: 0,
    $limit: 10,
  },
  count: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case QUERY_SCHOOLS:
      switch (action.status) {
        case PENDING:
        case ERROR:
          return {
            ...state,
            items: [],
          };
        case COMPLETE:
          return {
            ...state,
            items: action.result,
          };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default: return state;
  }
}
