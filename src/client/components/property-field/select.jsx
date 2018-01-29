import React from 'react';
import { shape, bool, string } from 'prop-types';
import bs from '../../styles/bootstrap.scss';
import { propertyShape } from '../../helpers/properties';

export default function Select(props) {
  const groupClasses = [bs.formGroup];
  const labelClasses = [bs.controlLabel, bs.colSm3];
  const fieldClasses = [bs.formControl];
  const property = props.property;
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


  if (props.meta.touched && !props.meta.valid && props.input.value) {
    groupClasses.push(bs.hasError, bs.hasFeedback);
  }

  return (
    <div className={groupClasses.join(' ')}>
      <label
        className={labelClasses.join(' ')}
        htmlFor={props.id}
      >
        {props.property.header}
      </label>
      <div className={bs.colSm9}>
        <select
          id={props.id}
          {...props.input}
          className={fieldClasses.join(' ')}
        >
          {property.required ? null : <option value="" />}
          {property.options.map(option => (
            <option
              disabled={option.disabled}
              value={option.value}
              key={option.label}
            >
              {option.label}
            </option>
          ))}
        </select>
        { props.meta.valid ? null : feedback }
      </div>
    </div>
  );
}

Select.propTypes = {
  meta: shape({ valid: bool.isRequired }).isRequired,
  property: propertyShape.isRequired,
  id: string.isRequired,
  input: shape({
  }).isRequired,
};
