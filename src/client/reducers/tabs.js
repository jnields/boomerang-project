import React from 'react';
import { Route } from 'react-router-dom';

import { QUERY_USERS, SELECT_ITEM } from '../actions/types';
import { PENDING, COMPLETE, ERROR } from '../actions/xhr-statuses';
import StudentTab from '../containers/student-tab';
import LeaderTab from '../containers/leader-tab';
import GroupTab from '../containers/group-tab';
import ReportTab from '../containers/report-tab';

import reportConfig from './report-config';


const initialState = {
  schoolTabs: [
    { name: 'Students', path: '/students' },
    { name: 'Leaders', path: '/leaders' },
    { name: 'Groups', path: '/groups' },
    { name: 'Reports', path: '/reports' },
  ],
  schoolRoutes: (
    <div>
      <Route path="/students" component={StudentTab} />
      <Route path="/leaders" component={LeaderTab} />
      <Route path="/groups" component={GroupTab} />
      <Route path="/reports" component={ReportTab} />
    </div>
  ),
  meta: {
    Students: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
        type: 'STUDENT',
      },
      count: 0,
      path: '/students',
      type: StudentTab,
    },
    Leaders: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
        type: 'LEADER',
      },
      selectedItem: null,
      count: 0,
      type: LeaderTab,
    },
    Groups: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
      },
      selectedItem: null,
      count: 0,
      type: GroupTab,
    },
    Reports: {
      type: ReportTab,
      config: reportConfig,
    },
  },
  selected: 'Students',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECT_ITEM:
      return {
        ...state,
        meta: {
          ...state.meta,
          [state.selected]: {
            ...state.meta[state.selected],
            selectedItem: action.item,
          },
        },
      };
    case QUERY_USERS:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            meta: {
              ...state.meta,
              [state.selected]: {
                ...state.meta[state.selected],
                query: action.query,
              },
            },
          };
        case COMPLETE:
          return {
            ...state,
            meta: {
              ...state.meta,
              [state.selected]: {
                ...state.meta[state.selected],
                items: action.result,
              },
            },
          };
        case ERROR:
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default:
      break;
  }
  return state;
}
