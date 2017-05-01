import React from 'react';
import {
  string, bool, func,
} from 'prop-types';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';

import {
  school as schoolProps,
  address as addressProps,
} from '../helpers/properties';

export default function SchoolForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,
    onSubmit,

    cancel,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Info</legend>
        {schoolProps.map(prop => (
          <PropertyField
            valid
            form={form}
            property={prop}
            key={prop.name}
          />
        ))}
      </fieldset>
      <fieldset>
        <legend>Address</legend>
        {addressProps.map(prop => (
          <PropertyField
            valid
            form={form}
            property={prop}
            key={prop.name}
          />
        ))}
      </fieldset>
      <div className={bs.formGroup}>
        <div className={[bs.colSmOffset3, bs.colSm9].join(' ')}>
          <div className={bs.btnToolbar}>
            <button
              type="button"
              className={[bs.btn, bs.btnPrimary].join(' ')}
              disabled={submitting}
              onClick={cancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={[bs.btn, bs.btnDefault].join(' ')}
              disabled={!valid || submitting}
            >
              { submitting ? <Spinner /> : null }
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

SchoolForm.propTypes = {
  valid: bool.isRequired,
  form: string.isRequired,
  handleSubmit: func.isRequired,
  submitting: bool.isRequired,

  onSubmit: func.isRequired,
  cancel: func.isRequired,
};

SchoolForm.defaultProps = {
  student: null,
};
