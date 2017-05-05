import {
  QUERY_SCHOOLS,
  SELECT_SCHOOL,
  SAVE_SCHOOL,
  DELETE_SCHOOL,
} from '../actions/types';
import { COMPLETE, PENDING, ERROR } from '../actions/xhr-statuses';

const initialState = {
  selectedSchool: null,
  items: [],
  query: {
    $offset: 0,
    $limit: 10,
  },
  querying: true,
  queryError: null,
  deleting: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECT_SCHOOL: {
      return {
        ...state,
        selectedSchool: action.result,
      };
    }
    case SAVE_SCHOOL:
      switch (action.status) {
        case PENDING:

        case COMPLETE:
        case ERROR:
        default: throw new TypeError('');
      }
    case QUERY_SCHOOLS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            querying: true,
            query: action.query,
          };
        case ERROR:
          return {
            ...state,
            querying: false,
            queryError: action.error,
          };
        case COMPLETE:
          return {
            ...state,
            items: action.result,
            querying: false,
            count: action.count,
          };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default: return state;
  }
}
