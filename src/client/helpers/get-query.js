export default function getQuery(params) {
  if (params == null) return '';
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    throw new TypeError('query params must be of type Object');
  }

  const queryParams = [];
  const keys = Object.keys(params);
  if (keys.length === 0) return '';
  const arrayParams = [];
  keys.forEach((key) => {
    if (Array.isArray(params[key])) {
      arrayParams[key] = params[key];
    } else {
      arrayParams[key] = [params[key]];
    }
    [].push.apply(
      queryParams,
      params[key].map(
          param =>
              `${encodeURIComponent(key)
               }=${encodeURIComponent(param)}`),
    );
  });
  return `?${queryParams.join('&')}`;
}
