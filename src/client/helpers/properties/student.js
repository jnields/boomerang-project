import user from './user';
import validate from './validate';

export default [
  ...user,
  {
    header: 'Homeroom',
    name: 'homeRoom',
    test: /(home\s*room)/i,
    type: 'text',
    maxLength: 255,
    validate,
  },
  {
    header: 'Teacher',
    name: 'teacher',
    test: /(teacher)/i,
    type: 'text',
    maxLength: 255,
    validate,
  },
  {
    header: 'Attended Orientation?',
    name: 'oriented',
    test: /(oriented|(attended)?\s*orientation)/i,
    type: 'checkbox',
  },
];
