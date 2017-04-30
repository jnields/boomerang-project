import React from 'react';
import { Field } from 'redux-form';
import { func, bool, string } from 'prop-types';

import { shape as propertyShape } from '../helpers/properties';
import bs from '../styles/bootstrap';
import Select from './select';

export default function PropertyField(props) {
  const {
    name,
    type,
    maxLength,
    min,
    max,
    required,
  } = props.property;
  const fieldProps = {
    name,
    type,
    maxLength,
    min,
    max,
    required,
    id: `${props.form}.${props.property.name}`,
    onBlur: props.onBlur,
    onChange: props.onChange,
    onFocus: props.onFocus,
  };

  const groupClasses = [bs.formGroup];
  const labelClasses = [];
  const fieldClasses = [];

  const feedback = (
    <span
      className={[
        bs.glyphicon,
        bs.glyphiconError,
        bs.formControlFeedback,
      ].join(' ')}
      aria-hidden="true"
    />
  );

  switch (props.property.type) {
    case 'text':
      fieldProps.component = 'input';
      break;
    case 'textarea':
      delete fieldProps.type;
      fieldProps.component = 'textarea';
      fieldProps.rows = 3;
      break;
    case 'number':
      fieldProps.component = 'input';
      break;
    case 'date':
      fieldProps.component = 'input';
      break;
    case 'select':
      delete fieldProps.type;
      fieldProps.component = Select;
      fieldProps.property = props.property;
      break;
    case 'checkbox':
      fieldProps.component = 'input';
      break;
    default: throw new TypeError('unhandled property type');
  }

  switch (props.property.type) {
    case 'text':
    case 'number':
    case 'textarea':
    case 'select':
    case 'date':
      labelClasses.push(bs.controlLabel, bs.colSm2);
      fieldClasses.push(bs.formControl);
      if (!props.valid) {
        groupClasses.push(bs.hasError, bs.hasFeedback);
      }
      return (
        <div className={groupClasses.join(' ')}>
          <label
            className={labelClasses.join(' ')}
            htmlFor={fieldProps.id}
          >
            {props.property.header}
          </label>
          <div className={bs.colSm10}>
            <Field
              {...fieldProps}
              className={fieldClasses.join(' ')}
            />
            {
              props.property.type !== 'select'
              && !props.valid
                ? feedback
                : null
            }
          </div>
        </div>
      );
    case 'checkbox':
      if (!props.valid) {
        groupClasses.push(bs.hasError);
      }
      return (
        <div className={groupClasses.join(' ')}>
          <div className={[bs.colSmOffset2, bs.colSm10].join(' ')}>
            <div className={bs.checkbox}>
              <label
                className={labelClasses.join(' ')}
                htmlFor={fieldProps.id}
              >
                <Field
                  {...fieldProps}
                  className={fieldClasses.join(' ')}
                />
                {props.property.header}
              </label>
            </div>
          </div>
        </div>
      );
    default:
      throw new TypeError('unhandled property type');
  }
}

PropertyField.propTypes = {
  property: propertyShape.isRequired,
  valid: bool.isRequired,
  form: string.isRequired,
  onChange: func,
  onBlur: func,
  onFocus: func,
};

PropertyField.defaultProps = {
  onChange: undefined,
  onBlur: undefined,
  onFocus: undefined,
};
