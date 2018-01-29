import xhr from 'xhr';
import windowOrGlobal from 'window-or-global';
import config from './config';
import getQuery from './get-query';
import handleAbort from './handle-abort';

export default {
  logIn: (username, password, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.post(
      '/api/auth/login',
      {
        ...config,
        body: { username, password },
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  logOut: () => {
    windowOrGlobal.document.cookie = 'SID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  patch: (id, body) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    xhr.patch(
      `api/auth/login/${id}`,
      {
        ...config,
        body,
      },
      (error, response) => (error ? reject(error) : resolve(response)),
    );
  }),
  requestReset: (username, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.post(
      '/api/auth/reset',
      {
        ...config,
        body: { username },
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  reset: ({ resetId, password }, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.put(
      '/api/auth/reset',
      {
        ...config,
        body: { resetId, password },
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  activate: (query, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.post(
      `/api/auth/activate${getQuery(query)}`,
      config,
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
};
