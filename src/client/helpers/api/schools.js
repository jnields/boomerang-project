import xhr from 'xhr';
import config from './config';
import getQuery from './get-query';
import handleAbort from './handle-abort';

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export default {
  query: (query, abort) => new Promise((resolve, reject) => {
    let cancel;
    const req = xhr.get(
      `/api/schools${getQuery(query)}`,
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
  get: (id, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    let cancel;
    const req = xhr.get(
      `/api/schools/${id}`,
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
      `/api/schools/${id}`,
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
      '/api/schools',
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
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  patch: (id, patch, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    if (!isObject(patch)) {
      throw new TypeError('patch must be plain object');
    }
    let cancel;
    const req = xhr.patch(
      `/api/schools/${id}`,
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
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
};
