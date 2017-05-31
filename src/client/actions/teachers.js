import { normalize } from 'normalizr';
import { EXTRA_LIST_ACTION } from './types';
import * as listActions from './list';
import { PENDING, COMPLETE, ERROR, UNSENT } from './xhr-statuses';

import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { teacher as fieldsets } from '../helpers/properties';

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

export const extraAction =
() =>
async (dispatch, getState) => {
  const type = EXTRA_LIST_ACTION;
  dispatch({ type, name: 'teachers', status: PENDING });
  try {
    const response = await api.auth.activate({
      type: 'TEACHER',
      schoolId: getState().lists.schools.selectedItem,
    });
    if (response.statusCode < 400) {
      const normalized = normalize(
        response.body,
        [userSchema],
      );
      return dispatch({ type, name: 'teachers', status: COMPLETE, ...normalized });
    }
    return dispatch({ type, name: 'teachers', status: ERROR });
  } catch (error) {
    return dispatch({ type, name: 'teachers', error, status: UNSENT });
  }
};
