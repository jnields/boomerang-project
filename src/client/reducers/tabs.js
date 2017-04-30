import React from 'react';
import { Route } from 'react-router-dom';

import {} from '../actions/types';
import StudentTab from '../containers/student-tab';
import LeaderTab from '../containers/leader-tab';
import GroupTab from '../containers/group-tab';
import ReportTab from '../containers/report-tab';


const initialState = {
  tabs: [
    { name: 'Students', path: '/students' },
    { name: 'Leaders', path: '/leaders' },
    { name: 'Groups', path: '/groups' },
    { name: 'Reports', path: '/reports' },
  ],
  meta: {
    Students: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
      },
      count: 0,
      path: '/students',
    },
    Leaders: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
      },
      count: 0,
      type: LeaderTab,
    },
    Groups: {
      items: [],
      query: {
        $offset: 0,
        $limit: 10,
      },
      count: 0,
      type: GroupTab,
    },
    Reports: {
      type: ReportTab,
    },
  },
  selected: 'Students',
  routes: (
    <div>
      <Route path="/students" component={StudentTab} />
      <Route path="/leaders" component={LeaderTab} />
      <Route path="/groups" component={GroupTab} />
      <Route path="/reports" component={ReportTab} />
    </div>
  ),
};

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      break;
  }
  return state;
}
