export default (value) => {
  if (value === null || value === undefined) return '';
  switch (value.constructor) {
    case Date:
      return new Date(+value + (value.getTimezoneOffset() * 60 * 1000)).toLocaleDateString();
    case String:
    case Number:
      return `${value}`;
    case Boolean:
      return value ? 'Y' : 'N';
    default:
      return value;
  }
};
