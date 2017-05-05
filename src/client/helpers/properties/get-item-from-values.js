export default (values, properties) => (properties.reduce(
  (acc, prop) => ({
    ...acc,
    ...(prop.setValue
      ? prop.setValue(acc, values[prop.name])
      : { [prop.name]: values[prop.name] }
    ),
  }),
  {},
));
