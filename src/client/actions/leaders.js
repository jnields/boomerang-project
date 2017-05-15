import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { leader as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'leaders',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  patch: api.users.patch,
  del: api.users.del,
  fieldsets,
};

async function getLeader(item) {
  return { ...item, type: 'LEADER' };
}

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch =>
dispatch(listActions.save(config, getLeader(item)));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, items.map(getLeader)));

export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
