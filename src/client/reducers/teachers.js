import { QUERY_TEACHERS } from '../actions/types';
import { COMPLETE, PENDING, ERROR } from '../actions/xhr-statuses';

const initialState = {
  count: 0,
  items: [],
  query: {
    type: 'TEACHER',
    $offset: 0,
    $limit: 10,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case QUERY_TEACHERS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            query: action.query,
          };
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
