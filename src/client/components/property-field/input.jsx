import React from 'react';
import { shape, string, bool, number } from 'prop-types';
import bs from '../../styles/bootstrap.scss';
import { propertyShape } from '../../helpers/properties';

export default function Input(props) {
  const groupClasses = [bs.formGroup];
  const labelClasses = [bs.controlLabel, bs.colSm3];
  const fieldClasses = [bs.formControl];
  const feedback = [
    <span
      key={1}
      className={[
        bs.glyphicon,
        bs.glyphiconError,
        bs.formControlFeedback,
      ].join(' ')}
      aria-hidden="true"
    />,
    <span
      key={2}
      className={[bs.helpBlock, bs.textDanger].join(' ')}
    >
      {props.meta.error}
    </span>,
  ];

  const showError = props.meta.touched && !props.meta.valid && props.input.value;

  if (showError) {
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
          maxLength={props.maxLength}
          type={props.type}
          className={fieldClasses.join(' ')}
        />
        { showError ? feedback : null }
      </div>
    </div>
  );
}

Input.propTypes = {
  meta: shape({ valid: bool.isRequired }).isRequired,
  property: propertyShape.isRequired,
  id: string.isRequired,
  type: string.isRequired,
  maxLength: number,
  input: shape({}).isRequired,
};
Input.defaultProps = { maxLength: undefined };
