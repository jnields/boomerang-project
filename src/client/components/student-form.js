import React from 'react';
import {
  string, bool, func,
} from 'prop-types';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';

import {
  student as studentProps,
  address as addressProps,
} from '../helpers/properties';

export default function StudentForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,

    cancel,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      {studentProps.map(prop => (
        <PropertyField
          valid
          form="student"
          property={prop}
          key={prop.name}
        />
      ))}
      {addressProps.map(prop => (
        <PropertyField
          valid
          form="student"
          property={prop}
          key={prop.name}
        />
      ))}
      <div className={bs.formGroup}>
        <div className={[bs.colSm2, bs.colSmOffset10].join(' ')}>
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

StudentForm.propTypes = {
  valid: bool.isRequired,
  form: string.isRequired,
  handleSubmit: func.isRequired,
  submitting: bool.isRequired,

  cancel: func.isRequired,
};

StudentForm.defaultProps = {
  student: null,
};
