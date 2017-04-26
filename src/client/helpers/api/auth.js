import xhr from 'xhr';
import config from './config';

export default {
  logIn: (username, password, abort) => new Promise((resolve, reject) => {
    let cancel = xhr.post(
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
  ).abort;
    if (abort !== undefined) {
      Promise.resolve(abort).then((a) => {
        if (a && cancel) cancel();
        resolve();
      });
    }
  }),
  logOut: () => {
    document.cookie = 'SID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  requestReset: (username, abort) => new Promise((resolve, reject) => {
    let cancel = xhr.put(
      `/api/auth/reset/${username}`,
      config,
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    ).abort;
    if (abort !== undefined) {
      Promise.resolve(abort).then((a) => {
        if (a && cancel) cancel();
        resolve();
      });
    }
  }),
  reset: (sessionId, password, abort) => new Promise((resolve, reject) => {
    let cancel = xhr.put(
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
    ).abort;
    if (abort !== undefined) {
      Promise.resolve(abort).then((a) => {
        if (a && cancel) cancel();
        resolve();
      });
    }
  }),
};
