import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { student as fieldsets } from '../helpers/properties';
import getOrCreateGroup from './get-or-create-group';

import * as listActions from './list';

const config = {
  name: 'students',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  patch: api.users.patch,
  del: api.users.del,
  fieldsets,
};

const getStudent =
item =>
async (dispatch) => {
  const result = { ...item, type: 'STUDENT' };
  result.groupId = await dispatch(getOrCreateGroup(item.groupName));
  delete result.groupName;
  return item;
};

const getStudents =
items =>
async (dispatch) => {
  const groups = {};
  items.forEach(({ groupName }) => {
    groups[groupName] = groups[groupName] || dispatch(getOrCreateGroup(groupName));
  });
  return items.map(async (item) => {
    const result = { ...item, type: 'STUDENT' };
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
dispatch(listActions.save(config, dispatch(getStudent(item))));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, dispatch(getStudents(items))));

export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
