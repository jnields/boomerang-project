import xhr from 'xhr';
import config from './config';
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
    document.cookie = 'SID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
    const req = xhr.put(
      `/api/auth/reset/${username}`,
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
  reset: (sessionId, password, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.put(
      '/api/auth/reset',
      {
        ...config,
        body: { sessionId, password },
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
};
