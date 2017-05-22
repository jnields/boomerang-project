import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authorization from './authorization';
import entities from './entities';
import lists from './lists';
import modal from './modal';
import reportItems from './report-items';
import reports from './reports';
import tabs from './tabs';

export default combineReducers({
  form,

  authorization,
  entities,
  lists,
  modal,
  reportItems,
  reports,
  tabs,
});
