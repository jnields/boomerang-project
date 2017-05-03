import React from 'react';
import { shape, string, bool } from 'prop-types';
import bs from '../../styles/bootstrap';
import { shape as propertyShape } from '../../helpers/properties';

export default function Input(props) {
  const groupClasses = [bs.formGroup];
  const labelClasses = [bs.controlLabel, bs.colSm3];
  const fieldClasses = [bs.formControl];

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
        htmlFor={props.input.id}
      >
        {props.property.header}
      </label>
      <div className={bs.colSm9}>
        <input
          {...props.input}
          type={props.type}
          className={fieldClasses.join(' ')}
        />
        { props.meta.valid ? null : feedback }
      </div>
    </div>
  );
}

Input.propTypes = {
  meta: shape({ valid: bool.isRequired }).isRequired,
  property: propertyShape.isRequired,
  id: string.isRequired,
  type: string.isRequired,
  input: shape({}).isRequired,
};
