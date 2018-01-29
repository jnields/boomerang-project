import validate from './validate';
import states from '../states.json';

const inverse = Object.keys(states).reduce(
  (accumulated, abbr) => ({
    ...accumulated,
    [states[abbr]]: abbr,
  }),
  {},
);

export default [
  {
    header: 'Line 1',
    name: 'line1',
    test: /line\s*1/i,
    type: 'text',
    validate,
    maxLength: 255,
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
    name: 'city',
    test: /city/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'State',
    name: 'state',
    test: /state/i,
    type: 'select',
    options: Object.keys(inverse).map(state => ({
      key: inverse[state],
      value: inverse[state],
      label: state,
    })),
    setValue: (obj, value) => {
      if (inverse[value]) {
        return { ...obj, state: inverse[value] };
      }
      if (states[value]) {
        return { ...obj, state: value };
      }
      return obj;
    },
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
