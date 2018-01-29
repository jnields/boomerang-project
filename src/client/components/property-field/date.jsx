import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { shape, instanceOf, oneOfType, bool, string } from 'prop-types';
import '../../styles/date-picker.scss';
import { propertyShape } from '../../helpers/properties';
import bs from '../../styles/bootstrap.scss';

const Moment = moment().constructor;

export default function RenderedDatePicker({
  input,
  id,
  property,
  meta: {
    touched,
    valid,
    // error,
  },
}) {
  const handleChange = (mmt) => {
    const date = mmt && mmt.constructor === Moment
      ? mmt.toDate()
      : mmt || null;
    input.onChange(date);
  };
  const groupClasses = [bs.formGroup];
  const labelClasses = [bs.controlLabel, bs.colSm3];
  // const fieldClasses = [bs.formControl];
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
  if (touched && !valid && input.value) {
    groupClasses.push(bs.hasError, bs.hasFeedback);
  }
  const selected = input.value && input.value.constructor === Date
    ? moment.utc(+input.value)
    : input.value || null;
  const inputCopy = { ...input };
  delete inputCopy.value;
  delete inputCopy.onBlur;
  return (
    <div className={groupClasses.join(' ')}>
      <label
        className={labelClasses.join(' ')}
        htmlFor={id}
      >
        {property.header}
      </label>
      <div className={bs.colSm9}>
        <DatePicker
          {...inputCopy}
          id={id}
          className={bs.formControl}
          placeholderText="mm/dd/yyyy"
          dateForm="MM/DD/YYYY"
          disabledKeyboardNavigation onChange={handleChange}
          selected={selected}
        />
        { valid ? null : feedback }
      </div>
    </div>
  );
}

RenderedDatePicker.propTypes = {
  id: string.isRequired,
  input: shape({
    value: oneOfType([
      instanceOf(Date),
      string,
    ]),
  }).isRequired,
  property: propertyShape.isRequired,
  meta: shape({
    touched: bool,
    error: bool,
  }).isRequired,
};
