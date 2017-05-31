function isObject(arg) {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

function isDate(arg) {
  return Object.prototype.toString.call(arg) === '[object Date]';
}

function normalizeParams(params) {
  if (!isObject(params)) {
    throw new TypeError('params argument must be of type Object');
  }
  const touched = new WeakSet();

  const normalized = (function normalize(args, depth) {
    return Object.keys(args).reduce(
      (accumulated, key) => {
        if (!isObject(args[key])) return accumulated;
        if (touched.has(args[key])) {
          throw new TypeError('Converting circular structure to query params');
        }
        touched.add(args[key]);
        const recursed = normalize(args[key], depth + 1);
        const innerNormalized = Object.keys(recursed).reduce(
          (innerAcc, innerKey) => ({
            ...innerAcc,
            [depth
                ? `${key}][${innerKey}`
                : `${key}[${innerKey}]`
              ]: recursed[innerKey],
          }),
          {},
        );
        const result = {
          ...accumulated,
          ...innerNormalized,
        };
        delete result[key];
        return result;
      },
      args,
    );
  }(params, 0));
  return normalized;
}

function stringifyParams(params) {
  if (!isObject(params)) {
    throw new TypeError('params argument must be of type Object');
  }

  const queryParams = [];
  const keys = Object.keys(params);
  if (keys.length === 0) return '';
  const arrayParams = [];
  keys.forEach((key) => {
    if (isObject(params[key])) {
      throw new TypeError('query params must be array or value');
    }
    if (Array.isArray(params[key])) {
      arrayParams[key] = params[key];
    } else {
      arrayParams[key] = [params[key]];
    }
    [].push.apply(
      queryParams,
      arrayParams[key].reduce(
        (acc, param) => {
          if (param === undefined) return acc;
          let toEncode = isDate(param)
            ? JSON.parse(JSON.stringify(param))
            : param;
          if (param === null) toEncode = '\u0000';
          return [
            ...acc,
            `${encodeURIComponent(key)}=${encodeURIComponent(toEncode)}`,
          ];
        },
        [],
      ),
    );
  });
  return `?${queryParams.join('&')}`;
}


export default function getQuery(params) {
  if (params == null) return '';
  return stringifyParams(normalizeParams(params));
}
