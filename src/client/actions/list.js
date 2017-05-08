import { normalize } from 'normalizr';
import LoadXlsxWorker from '../workers/load-xlsx';

import {
  SAVE,
  UPDATE,
  DELETE,
  QUERY,
  PARSE,
  UPLOAD,
  CLEAR_PARSED,
  SELECT_ITEM,
} from './types';

import {
  PENDING,
  COMPLETE,
  ERROR,
  UNSENT,
} from './xhr-statuses';

export const selectItem =
({ name }, item = {}) =>
({ type: SELECT_ITEM, name, item: item.id });

export const clearParsed =
({ name }) =>
({ type: CLEAR_PARSED, name });

const abort = {};
export const query =
(config, params = {}) =>
async (dispatch) => {
  const { name, query: sendQuery, schema } = config;
  if (abort[name]) abort(true);
  const type = QUERY;
  dispatch({ type, name, status: PENDING, params });

  let response;
  try {
    response = await sendQuery(
      params,
      new Promise((resolve) => {
        abort[name] = resolve;
      }),
    );
    abort[name] = null;
  } catch (error) {
    abort[name] = null;
    dispatch({ type, status: UNSENT, error });
    throw error;
  }
  const { statusCode = 500, body = {} } = (response || {});
  const { results = [], count = 0, error } = body;

  if (statusCode >= 400) {
    dispatch({ type, name, status: ERROR, statusCode, error });
    return;
  }

  if (count > 0 && results.length === 0) {
    await query(
      config,
      {
        ...params,
        $offset: count - (count % params.$limit),
      },
    )(dispatch);
  } else {
    dispatch({
      type,
      name,
      status: COMPLETE,
      response,
      count,
      ...normalize(results, [schema]),
    });
  }
};

export const save =
({ name, post, schema }, item) =>
async (dispatch) => {
  const type = SAVE;
  dispatch({ type, name, status: PENDING });
  let response;
  try {
    response = await post(await item);
  } catch (error) {
    dispatch({ type, name, status: UNSENT, error });
    throw error;
  }
  const { statusCode = 500, body = {} } = (response || {});
  if (statusCode >= 400) {
    const { error } = body;
    dispatch({
      type,
      status: ERROR,
      statusCode,
      response,
      error,
    });
    return;
  }
  const normalized = normalize(
    body,
    schema,
  );
  dispatch({
    type,
    name,
    status: COMPLETE,
    response,
    ...normalized,
  });
};

export const upload =
({ name, post, schema }, items) =>
async (dispatch) => {
  const type = UPLOAD;
  dispatch({ type, name, status: PENDING });
  let response;
  try {
    response = await post(await Promise.all(items));
  } catch (error) {
    dispatch({ type, name, status: UNSENT, error });
    throw error;
  }
  const { statusCode = 500, body = [] } = (response || {});
  if (statusCode >= 400) {
    const { error } = body;
    dispatch({
      type,
      status: ERROR,
      statusCode,
      response,
      error,
    });
    return;
  }
  const normalized = normalize(
    body,
    [schema],
  );
  dispatch({
    type,
    name,
    status: COMPLETE,
    response,
    ...normalized,
  });
};

export const update =
({ name, patch: sendPatch, schema }, id, patch) =>
async (dispatch) => {
  const type = UPDATE;
  dispatch({ type, name, status: PENDING, id, patch });
  let response;
  try {
    response = await sendPatch(id, await patch);
  } catch (error) {
    dispatch({ type, name, status: UNSENT, id, patch });
    throw error;
  }
  const { statusCode = 500, body = {} } = (response || {});
  if (statusCode >= 400) {
    const { error } = body;
    dispatch({ type, name, error, status: ERROR, statusCode });
    return;
  }

  dispatch({
    type,
    name,
    status: COMPLETE,
    ...normalize(
      response.body,
      schema,
    ),
  });
};

export const del =
({ name, del: sendDelete, schemaName }, id) =>
async (dispatch) => {
  const type = DELETE;
  dispatch({ type, name, status: PENDING });
  let response;
  try {
    response = await sendDelete(await id);
  } catch (error) {
    dispatch({ type, name, status: UNSENT, error, id });
    throw error;
  }
  const { statusCode = 500, body = {} } = (response || {});
  if (statusCode >= 400) {
    dispatch({ type, name, status: ERROR, statusCode, error: body.error });
    return;
  }
  dispatch({
    type,
    name,
    status: COMPLETE,
    id,
    entities: {
      [schemaName]: { [id]: undefined },
    },
  });
};

export const parse =
({ name, fieldsets }, files) =>
async (dispatch) => {
  const worker = new LoadXlsxWorker();
  const type = PARSE;
  worker.onmessage = ({ data: { results, error } }) => {
    if (error) {
      dispatch({ type, name, status: ERROR, error });
    } else {
      dispatch({ type, name, status: COMPLETE, results });
    }
  };
  dispatch({ type, name, status: PENDING });
  worker.postMessage({
    files,
    properties: fieldsets.reduce(
      (flattened, fieldset) => [...flattened, ...fieldset.properties],
      [],
    ).map(prop => ({
      test: prop.test,
      name: prop.name,
    })),
  });
};
