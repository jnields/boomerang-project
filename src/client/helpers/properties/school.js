import validate from './validate';

export default [
  {
    header: 'Name',
    name: 'name',
    test: /(name)/i,
    type: 'text',
    maxLength: 255,
    validate,
  },
];
