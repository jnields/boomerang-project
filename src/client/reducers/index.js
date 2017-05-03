import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authorization from './authorization';
import entities from './entities';
import tabs from './tabs';
import modal from './modal';
import schools from './schools';
import teachers from './teachers';
import students from './students';
import leaders from './leaders';
import reports from './reports';
import groups from './groups';

export default combineReducers({
  authorization,
  entities,
  form,
  tabs,
  modal,
  schools,
  teachers,
  students,
  leaders,
  reports,
  groups,
});
