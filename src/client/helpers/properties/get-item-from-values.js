export default (values, properties) => (properties.reduce(
  (acc, prop) => (
    prop.setValue
        ? prop.setValue(acc, values[prop.name])
        : { ...acc, [prop.name]: values[prop.name] }
  ),
  {},
));
