import xhr from 'xhr';
import config from './config';
import getQuery from './get-query';
import handleAbort from './handle-abort';

export default {
  query: (query, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.get(
      `/api/users${getQuery(query)}`,
      config,
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        if (response
            && response.body
            && response.body.results
            && Array.isArray(response.body.results)
        ) {
          return resolve({
            ...response,
            body: {
              ...response.body,
              results: response.body.results.map(user => ({
                ...user,
                dob: user.dob ? new Date(user.dob) : null,
              })),
            },
          });
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  get: (id, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    let cancel;
    const req = xhr.get(
      `/api/users/${id}`,
      config,
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        if (response && response.body) {
          return resolve({
            ...response,
            body: {
              ...response.body,
              dob: response.body.dob ? new Date(response.body.dob) : null,
            },
          });
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  delAll: (query, abort) => new Promise((resolve, reject) => {
    if (query == null
        || typeof query !== 'object'
        || Object.keys(query).length === 0
    ) {
      throw new TypeError('cannot delete all without query parameters');
    }
    let cancel;
    const req = xhr.del(
      `/api/users${getQuery(query)}`,
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
  del: (id, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    let cancel;
    const req = xhr.del(
      `/api/users/${id}`,
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
  post: (obj, abort) => new Promise((resolve, reject) => {
    const type = Object.prototype.toString.call(obj);
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
    let cancel;
    const req = xhr.post(
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
        if (response && response.body) {
          if (Array.isArray(response.body)) {
            return resolve({
              ...response,
              body: response.body.map(ur => ({
                ...ur,
                dob: ur.dob ? new Date(ur.dob) : null,
              })),
            });
          }
          return resolve({
            ...response,
            body: {
              ...response.body,
              dob: response.body.dob ? new Date(response.body.dob) : null,
            },
          });
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  patchAll: (patches, abort) => new Promise((resolve, reject) => {
    if (!Array.isArray(patches)) throw new TypeError();
    patches.forEach((patch) => {
      if (patch == null && patch.id == null) throw new TypeError();
    });
    let cancel;
    const req = xhr.patch(
      '/api/users',
      {
        ...config,
        body: patches,
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        if (response && response.body && Array.isArray(response.body)) {
          return resolve({
            ...response,
            body: response.body.map(ur => ({
              ...ur,
              dob: ur.dob ? new Date(ur.dob) : null,
            })),
          });
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  patch: (id, patch, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    if (Object.prototype.toString.call(patch) !== '[object Object]') {
      throw new TypeError('patch must be plain object');
    }
    let cancel;
    const req = xhr.patch(
      `/api/users/${id}`,
      {
        ...config,
        body: patch,
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        if (response && response.body) {
          return resolve({
            ...response,
            body: {
              ...response.body,
              dob: response.body.dob ? new Date(response.body.dob) : null,
            },
          });
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
};
