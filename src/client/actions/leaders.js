import { denormalize } from 'normalizr';

import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { leader as fieldsets } from '../helpers/properties';

import * as listActions from './list';
import getOrCreateGroup from './get-or-create-group';

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

const getLeader =
(item, id) =>
async (dispatch, getState) => {
  let oldGroup;
  if (id) {
    oldGroup = denormalize(
      id,
      userSchema,
      getState().entities,
    ).group;
  }
  const result = { ...item, type: 'LEADER' };
  result.groupId = await dispatch(getOrCreateGroup(item.groupName, oldGroup, id));
  delete result.groupName;
  return result;
};

const getLeaders =
items =>
async (dispatch) => {
  const groups = {};
  items.forEach(({ groupName }) => {
    groups[groupName] = groups[groupName] || dispatch(getOrCreateGroup(groupName));
  });
  return items.map(async (item) => {
    const result = { ...item, type: 'LEADER' };
    result.groupId = await groups[item.groupName];
    delete result.groupName;
    return result;
  });
};

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch =>
dispatch(listActions.save(config, dispatch(getLeader(item))));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, dispatch(getLeaders(items))));

export const update =
(id, patch) =>
dispatch =>
dispatch(listActions.update(config, id, dispatch(getLeader(patch, id))));
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
