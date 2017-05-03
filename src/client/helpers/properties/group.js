import validate from './validate';

export default [
  {
    header: 'Name',
    name: 'name',
    test: /(name)/i,
    type: 'text',
    maxLength: 255,
    required: true,
    validate,
  },
  {
    header: 'Room Number',
    name: 'roomNumber',
    test: /(room\s*number)/i,
    type: 'text',
    maxLength: 255,
    validate,
  },
  {
    header: 'Notes',
    name: 'notes',
    test: /(notes)/i,
    type: 'textarea',
    maxLength: 2550,
    validate,
  },
];
