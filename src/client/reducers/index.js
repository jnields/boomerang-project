import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authorization from './authorization';
import entities from './entities';
import tabs from './tabs';

export default combineReducers({
  authorization,
  entities,
  form,
  tabs,
});
