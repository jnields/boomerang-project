import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { teacher as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'teachers',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  patch: api.users.patch,
  del: api.users.del,
  fieldsets,
};

async function getTeacher(schoolId, item) {
  return {
    ...item,
    schoolId,
    type: 'TEACHER',
  };
}

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
(dispatch, getState) => {
  const schoolId = getState().lists.schools.selectedItem;
  return dispatch(listActions.save(config, getTeacher(schoolId, item)));
};

export const upload =
items =>
(dispatch, getState) => {
  const schoolId = getState().lists.schools.selectedItem;
  return dispatch(listActions.upload(config, items.map(getTeacher.bind(null, schoolId))));
};

export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
