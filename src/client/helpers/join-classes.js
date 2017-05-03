export default function joinClasses(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new TypeError('argument must be plain object');
  }
  return Object.keys(obj).reduce(
    (acc, className) => {
      if (obj[className]) acc.push(className);
      return acc;
    },
    [],
  ).join(' ');
}
