import { combineReducers } from 'redux';
import { student, leader, teacher, group, school } from '../helpers/properties';

import {
  SAVE,
  QUERY,
  UPDATE,
  DELETE,
  UPLOAD,

  PARSE,
  SELECT_ITEM,
  CLEAR_PARSED,
  ASSIGN_GROUPS,
} from '../actions/types';

import {
  PENDING,
  COMPLETE,
  ERROR,
  UNSENT,
} from '../actions/xhr-statuses';

const initialState = {
  saving: false,
  saveError: null,
  querying: true,
  queryError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
  parsing: false,
  parseError: null,
  uploading: false,
  uploadError: null,
  assigningGroups: false,
  assignGroupsError: null,

  items: [],
  count: 0,
  selectedItem: null,
  parsedItems: [],
};

const connectionError = '';

const subReducer = (name, params = { $offset: 0, $limit: 10 }, fieldsets) =>
(state = { ...initialState, params, fieldsets }, action) => {
  if (action.name !== name) return state;
  switch (action.type) {
    case SAVE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            saving: true,
            saveError: null,
          };
        case COMPLETE:
          return {
            ...state,
            saving: false,
          };
        case ERROR:
          return {
            ...state,
            saving: false,
            saveError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            saving: false,
            saveError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case QUERY:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            querying: true,
            queryError: null,
            params: action.params,
            items: action.reset ? [] : state.items,
          };
        case COMPLETE:
          return {
            ...state,
            querying: false,
            items: action.result,
            count: action.count,
          };
        case ERROR:
          return {
            ...state,
            querying: false,
            queryError: action.error,
            items: [],
          };
        case UNSENT:
          return {
            ...state,
            querying: false,
            queryError: connectionError,
            items: [],
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case UPDATE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            updating: true,
            updateError: null,
          };
        case COMPLETE:
          return {
            ...state,
            updating: false,
          };
        case ERROR:
          return {
            ...state,
            updating: false,
            updateError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            updating: false,
            updateError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case DELETE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            deleting: true,
          };
        case COMPLETE: {
          const items = state.items;
          const ix = items.indexOf(action.id);
          if (ix > -1) {
            items.splice(ix, 1);
          }
          return {
            ...state,
            deleting: false,
            items,
          };
        }
        case ERROR:
          return {
            ...state,
            deleting: false,
            deleteError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            deleting: false,
            deleteError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case SELECT_ITEM:
      return {
        ...state,
        selectedItem: action.item,
      };
    case PARSE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            parsing: true,
            parsedItems: [],
            parseError: null,
          };
        case COMPLETE:
          return {
            ...state,
            parsing: false,
            parsedItems: action.results,
          };
        case ERROR:
          return {
            ...state,
            parsing: false,
            parseError: action.error,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case UPLOAD:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            uploading: true,
            uploadError: null,
          };
        case COMPLETE:
          return {
            ...state,
            uploading: false,
            parsedItems: [],
          };
        case ERROR:
          return {
            ...state,
            uploading: false,
            uploadError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            uploading: false,
            uploadError: connectionError,
          };
        default:
          throw new TypeError(`unhandled type: ${action.status}`);
      }
    case CLEAR_PARSED:
      return {
        ...state,
        parsedItems: [],
        parseError: null,
        uploadError: null,
      };
    case ASSIGN_GROUPS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            assigningGroups: true,
            assignGroupsError: null,
          };
        case COMPLETE:
          return {
            ...state,
            assigningGroups: false,
          };
        case ERROR:
        case UNSENT:
          return {
            ...state,
            assigningGroups: false,
            assignGroupsError: action.error,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    default:
      return state;
  }
};

const paged = { $limit: 10, $offset: 0 };
export default combineReducers({
  schools: subReducer(
    'schools',
    paged,
    school,
  ),
  groups: subReducer(
    'groups',
    paged,
    group,
  ),
  teachers: subReducer(
    'teachers',
    { ...paged, type: 'TEACHER' },
    teacher,
  ),
  students: subReducer(
    'students',
    { ...paged, type: 'STUDENT' },
    student,
  ),
  leaders: subReducer(
    'leaders',
    { ...paged, type: 'LEADER' },
    leader,
  ),
});
