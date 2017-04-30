import validate from './validate';

export default [
  {
    header: 'Line 1',
    name: 'line1',
    test: /line\s*1/i,
    type: 'text',
    validate,
    maxLength: 255,
    required: true,
  },
  {
    header: 'Line 2',
    name: 'line2',
    test: /line\s*2/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'City',
    name: 'City',
    test: /city/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'State',
    name: 'state',
    test: /state/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'ZIP',
    name: 'zip',
    test: /zip/i,
    type: 'text',
    pattern: /[0-9]{5}(-[0-9]{4})?/,
    validate,
    maxLength: 255,
  },
];
