import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { leader as fieldsets } from '../helpers/properties';

import * as listActions from './list';
import getUser from './get-user';
import getUsers from './get-users';

const config = {
  name: 'leaders',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  patch: api.users.patch,
  del: api.users.del,
  delAll: api.users.delAll,
  fieldsets,
};

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch =>
dispatch(listActions.save(config, dispatch(getUser(item, 'LEADER'))));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, getUsers(items, 'LEADER')));

export const update =
(id, patch) =>
dispatch =>
dispatch(listActions.update(config, id, dispatch(getUser(patch, 'LEADER', id))));

export const delAll =
() =>
dispatch => dispatch(listActions.delAll(config, { type: 'LEADER' }));

export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
