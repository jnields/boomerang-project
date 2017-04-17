import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authorization from './authorization';
import entities from './entities';

export default combineReducers({
  authorization,
  entities,
  form,
});
