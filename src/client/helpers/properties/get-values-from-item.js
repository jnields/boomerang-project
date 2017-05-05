export default (obj, properties) => (properties.reduce(
  (acc, prop) => ({
    ...acc,
    [prop.name]: prop.getValue
      ? prop.getValue(obj)
      : obj[prop.name],
  }),
  {},
));
