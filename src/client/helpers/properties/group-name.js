import validate from './validate';

export default {
  header: 'Group Name',
  name: 'groupName',
  test: /group\s*name/i,
  type: 'text',
  maxLength: 255,
  validate,
};
