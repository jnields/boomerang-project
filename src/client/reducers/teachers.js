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
  querying: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case QUERY_TEACHERS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            query: action.query,
            querying: true,
          };
        case ERROR:
          return {
            ...state,
            items: [],
            querying: false,
          };
        case COMPLETE:
          return {
            ...state,
            items: action.result,
            querying: false,
          };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default: return state;
  }
}
