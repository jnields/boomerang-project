import React from 'react';
import { shape, string, bool } from 'prop-types';
import bs from '../../styles/bootstrap';
import { propertyShape } from '../../helpers/properties';

export default function Textarea(props) {
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
        <textarea
          {...props.input}
          rows={3}
          style={{ resize: 'none' }}
          onInput={(e) => {
            const el = e.target;
            const style = el.currentStyle || window.getComputedStyle(el);
            const boxSizing = style.boxSizing === 'border-box'
                ? parseInt(style.borderBottomWidth, 10) +
                  parseInt(style.borderTopWidth, 10)
                : 0;
            el.style.height = '';
            el.style.height = `${el.scrollHeight + boxSizing}px`;
          }}
          className={fieldClasses.join(' ')}
        />
        { props.meta.valid ? null : feedback }
      </div>
    </div>
  );
}

Textarea.propTypes = {
  meta: shape({ valid: bool.isRequired }).isRequired,
  property: propertyShape.isRequired,
  id: string.isRequired,
  input: shape({}).isRequired,
};
