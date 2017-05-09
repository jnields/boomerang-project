import { normalize } from 'normalizr';
import { group as groupSchema } from '../helpers/schema';
import api from '../helpers/api';
import { GET, SAVE, DELETE } from '../actions/types';
import { COMPLETE, PENDING, ERROR } from '../actions/xhr-statuses';

const deleteOld =
(oldGroup, userId) =>
async (dispatch) => {
  if (oldGroup == null) return false;
  const type = DELETE;
  const name = 'groups';
  const {
    body: { count },
  } = await api.users.query({
    id: { $ne: userId },
    group: {
      name: oldGroup.name,
      notes: { $ne: null },
      roomNumber: { $ne: null },
    },
    $limit: 1,
  });
  if (count) return false;
  const id = oldGroup.id;
  dispatch({ type, name, status: PENDING, id });
  try {
    const response = await api.groups.del(oldGroup.id);
    dispatch({ type, name, status: COMPLETE, id, response });
  } catch (error) {
    dispatch({ type, name, status: ERROR, error });
  }
  return true;
};

const saveNew =
name =>
async (dispatch) => {
  if (!name) return null;
  const {
    body: {
      count,
      results,
    },
  } = await api.groups.query({ name, $limit: 1 });
  if (count) {
    const normalized = normalize(results[0], groupSchema);
    dispatch({
      type: GET,
      name: 'groups',
      status: COMPLETE,
      ...normalized,
    });
    return results[0].id;
  }
  const { body } = await api.groups.post({ name });
  const normalized = normalize(body, groupSchema);
  dispatch({
    type: SAVE,
    status: COMPLETE,
    name: 'groups',
    ...normalized,
  });
  return normalized.result;
};


const queue = {};
function waitInQueue(name, cb) {
  queue[name] = Promise.resolve(queue[name]).then(() => cb());
  return queue[name];
}

export default (name, oldGroup, userId) =>
dispatch => waitInQueue(name, async () => {
  const [/* deleted */, result] = await Promise.all([
    dispatch(deleteOld(oldGroup, userId)),
    dispatch(saveNew(name, dispatch)),
  ]);
  return result;
});
