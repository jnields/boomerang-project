import {
  QUERY_LEADERS,
  SELECT_LEADER,
  PARSE_LEADER_FILE,
  SAVE_UPLOADED_LEADERS,
  CLEAR_UPLOADED_LEADERS,
  CLOSE_MODAL,
  DELETE_LEADER,
} from '../actions/types';
import { PENDING, COMPLETE, ERROR } from '../actions/xhr-statuses';

const initialState = {
  items: [],
  uploading: false,
  uploaded: [],
  uploadError: null,
  savingUploaded: false,
  query: {
    $offset: 0,
    $limit: 10,
    type: 'LEADER',
  },
  selectedLeader: null,
  count: 0,
  deleting: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return { ...state, selectedLeader: null };
    case SELECT_LEADER:
      return { ...state, selectedLeader: action.leader };
    case QUERY_LEADERS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            query: action.query,
          };
        case COMPLETE:
          return {
            ...state,
            items: action.result,
            count: action.count,
          };
        case ERROR:
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    case PARSE_LEADER_FILE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            uploading: true,
            uploaded: [],
          };
        case COMPLETE:
          return {
            ...state,
            uploading: false,
            uploaded: action.results,
            uploadError: null,
          };
        case ERROR:
          return {
            ...state,
            uploading: false,
            uploadError: action.error,
          };
        default : throw new TypeError(`unhandled case: ${action.status}`);
      }
    case CLEAR_UPLOADED_LEADERS:
      return {
        ...state,
        uploaded: [],
      };
    case SAVE_UPLOADED_LEADERS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            savingUploaded: true,
          };
        case COMPLETE:
          return {
            ...state,
            savingUploaded: false,
            uploaded: [],
          };
        case ERROR:
          return {
            ...state,
            savingUploaded: false,
          };
        default : throw new TypeError(`unhandled case: ${action.status}`);
      }
    case DELETE_LEADER:
      switch (action.status) {
        case PENDING:
          return { ...state, deleting: true };
        case COMPLETE: {
          const items = state.items;
          const ix = items.indexOf(action.leader);
          if (ix !== -1) {
            items.splice(ix, 1);
          }
          return { ...state, items, deleting: false };
        }
        case ERROR:
          return { ...state, deleting: false };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default: return state;
  }
}
