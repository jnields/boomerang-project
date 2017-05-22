function isDate(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
}

function utcFromDate(date) {
  const hasTime =
    +new Date(date.getFullYear(), date.getMonth(), date.getDate())
    - date;
  if (hasTime) throw new TypeError('date provided with time');
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return new Date(utc);
}

function utcFromArgs(arg) {
  const date = new Date(arg);
  if (isNaN(date)) {
    throw new TypeError('invalid date');
  }
  return utcFromDate(date);
}

export function getUTCDate(arg) {
  return arg && arg.constructor === Date
    ? utcFromDate(arg)
    : utcFromArgs(arg);
}

export function addTimeZoneOffset(utc) {
  if (isNaN(utc) || !isDate(utc)) {
    throw new TypeError('argument must be valid date');
  }
  return new Date(+utc + (utc.getTimezoneOffset() * 60 * 1000));
}
