import React from 'react';
import { shape, string, bool } from 'prop-types';
import bs from '../../styles/bootstrap';
import { propertyShape } from '../../helpers/properties';

export default function Checkbox(props) {
  const groupClasses = [bs.formGroup];
  const labelClasses = [bs.controlLabel];
  const fieldClasses = [];
  if (props.meta.touched && !props.meta.valid && props.input.value) {
    groupClasses.push(bs.hasError);
  }
  return (
    <div className={groupClasses.join(' ')}>
      <div className={[bs.colSmOffset3, bs.colSm9].join(' ')}>
        <div className={bs.checkbox}>
          <label
            className={labelClasses.join(' ')}
            htmlFor={props.input.id}
          >
            <input
              {...props.input}
              type="checkbox"
              className={fieldClasses.join(' ')}
            />
            {props.property.header}
          </label>
        </div>
      </div>
    </div>
  );
}

Checkbox.propTypes = {
  meta: shape({ valid: bool.isRequired }).isRequired,
  property: propertyShape.isRequired,
  id: string.isRequired,
  input: shape({}).isRequired,
};
