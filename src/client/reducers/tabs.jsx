import React from 'react';
import { Route } from 'react-router-dom';

import StudentTab from '../containers/student-tab';
import LeaderTab from '../containers/leader-tab';
import GroupTab from '../containers/group-tab';
import ReportTab from '../containers/report-tab';

const initialState = {
  schoolTabs: [
    { name: 'Students', path: '/' },
    { name: 'Leaders', path: '/leaders' },
    { name: 'Groups', path: '/groups' },
    { name: 'Reports', path: '/reports' },
  ],
  schoolRoutes: (
    <div>
      <Route path="/" exact strict component={StudentTab} />
      <Route path="/leaders" component={LeaderTab} />
      <Route path="/groups" component={GroupTab} />
      <Route path="/reports" component={ReportTab} />
    </div>
  ),
};

export default state => state || initialState;
