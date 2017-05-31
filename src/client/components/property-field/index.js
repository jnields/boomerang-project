import React from 'react';
import { Field } from 'redux-form';
import { string } from 'prop-types';

import DatePicker from './date';
import Input from './input';
import Select from './select';
import Textarea from './textarea';
import Checkbox from './checkbox';

import { propertyShape } from '../../helpers/properties';

export default function PropertyField(props) {
  const {
    name,
    type,
    maxLength,
    min,
    max,
    required,
    validate,
  } = props.property;
  const fieldProps = {
    id: `${props.form}.${props.property.name}`,
    type,
    maxLength,
    min,
    max,
    required,
    name,
    validate: validate ? validate.bind(props.property) : null,
    property: props.property,
  };


  switch (props.property.type) {
    case 'select':
      return (
        <Field
          {...fieldProps}
          component={Select}
        />
      );
    case 'textarea':
      return (
        <Field
          {...fieldProps}
          component={Textarea}
        />
      );
    case 'date':
      return (
        <Field
          {...fieldProps}
          component={DatePicker}
        />
      );
    case 'text':
    case 'number':
    case 'password':
      return (
        <Field
          {...fieldProps}
          component={Input}
        />
      );
    case 'checkbox':
      return (
        <Field
          {...fieldProps}
          component={Checkbox}
        />
      );
    default:
      throw new TypeError('unhandled property type');
  }
}

PropertyField.propTypes = {
  property: propertyShape.isRequired,
  form: string.isRequired,
};
