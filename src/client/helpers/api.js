import xhr from 'xhr';
import getQuery from './get-query';

const config = {
  json: true,
  withCredentials: true,
  timeout: 5000,
};

export default {
  auth: {
    logIn: (username, password, abort) => new Promise((resolve, reject) => {
      let cancel = xhr.post(
        '/api/login',
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
    reset: (sessionId, password, abort) => new Promise((resolve, reject) => {
      let cancel = xhr.put(
        '/api/login',
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
  },
  users: {
    query: (query, abort) => new Promise((resolve, reject) => {
      let cancel = xhr.get(
                `/api/users${getQuery(query)}`,
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
    get: (id, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      let cancel = xhr.get(
                `/api/users/${id}`,
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
    delete: (id, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      let cancel = xhr.del(
                `/api/users/${id}`,
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
    post: (obj, abort) => new Promise((resolve, reject) => {
      const type = Object.toString.call(obj);
      let correctType = type === '[object Object]';

      if (type === '[object Array]') {
        for (let i = 0; i < obj.length; i += 1) {
          correctType = Object.prototype.toString.call(obj[i])
                        === '[object Object]';
          if (!correctType) break;
        }
      }
      if (!correctType) {
        throw new TypeError(
                    'POST body must be plain object or array of plain objects',
                );
      }
      let cancel = xhr.post(
                '/api/users',
        {
          ...config,
          body: obj,
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
    patch: (id, patch, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      if (Object.toString.call(patch) !== '[object Object]') {
        throw new TypeError('patch must be plain object');
      }
      let cancel = xhr.patch(
                `/api/users${id}`,
        {
          ...config,
          body: patch,
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
  },
  schools: {
    query: (query, abort) => new Promise((resolve, reject) => {
      let cancel = xhr.get(
                `/api/users${getQuery(query)}`,
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
    get: (id, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      let cancel = xhr.get(
                `/api/users/${id}`,
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
    delete: (id, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      let cancel = xhr.del(
                `/api/users/${id}`,
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
    post: (obj, abort) => new Promise((resolve, reject) => {
      const type = Object.toString.call(obj);
      let correctType = type === '[object Object]';

      if (type === '[object Array]') {
        for (let i = 0; i < obj.length; i += 1) {
          correctType = Object.prototype.toString.call(obj[i])
                        === '[object Object]';
          if (!correctType) break;
        }
      }
      if (!correctType) {
        throw new TypeError(
                    'POST body must be plain object or array of plain objects',
                );
      }
      let cancel = xhr.post(
                '/api/users',
        {
          ...config,
          body: obj,
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
    patch: (id, patch, abort) => new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        throw new TypeError('id must be of type number');
      }
      if (Object.toString.call(patch) !== '[object Object]') {
        throw new TypeError('patch must be plain object');
      }
      let cancel = xhr.patch(
                `/api/users${id}`,
        {
          ...config,
          body: patch,
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
  },
};
