import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authorization from './authorization';
import entities from './entities';
import tabs from './tabs';
import modal from './modal';
import lists from './lists';
import reports from './reports';

export default combineReducers({
  authorization,
  entities,
  form,
  tabs,
  modal,
  reports,
  lists,
});
