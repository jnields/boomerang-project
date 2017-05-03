import {
  oneOf,
  oneOfType,
  arrayOf,
  string,
  func,
  shape,
  instanceOf,
  number,
  bool,
} from 'prop-types';

export default shape({
  header: string.isRequired,
  name: string.isRequired,
  test: instanceOf(RegExp).isRequired,
  type: oneOf([
    'text',
    'textarea',
    'number',
    'date',
    'select',
    'checkbox',
    'password',
  ]).isRequired,
  options: arrayOf(shape({
    label: string.isRequired,
    value: oneOfType([
      string,
      bool,
      number,
    ]).isRequired,
    disabled: bool,
  })),
  validate: func,
  asyncValidate: func,
  maxLength: number,
  min: number,
  max: number,
  required: bool,
});
