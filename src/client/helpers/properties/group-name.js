import validate from './validate';

export default {
  header: 'Group Name',
  name: 'groupName',
  test: /group(\s*name)?/i,
  type: 'text',
  maxLength: 255,
  setValue: (obj, value) => ({
    ...obj,
    group: !value
      ? obj.group
      : { ...obj.group, name: value },
  }),
  getValue: obj => (obj.group || {}).name,
  validate,
};
