function isDate(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
}

export function parseUTCDate(...args) {
  const date = new Date(...args);
  if (isNaN(date)) {
    throw new TypeError('invalid date');
  }
  const hasTime =
    +new Date(date.getFullYear(), date.getMonth(), date.getDate())
    - date;
  if (hasTime) throw new TypeError('date provided with time');
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return new Date(utc);
}

export function addTimeZoneOffset(utc) {
  if (isNaN(utc) || !isDate(utc)) {
    throw new TypeError('argument must be valid date');
  }
  return new Date(+utc + (utc.getTimezoneOffset() * 60 * 1000));
}
