import React from 'react';
import {
  string, bool, func,
} from 'prop-types';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';
import validate from '../helpers/properties/validate';
import {
  teacher as teacherProps,
} from '../helpers/properties';

const pw = {
  header: 'Password',
  name: 'password',
  test: /./,
  validate,
  type: 'password',
  minLength: 8,
  maxLength: 255,
  required: true,
};
const pwConfirm = {
  header: 'Confirm',
  name: 'passwordConfirmation',
  type: 'password',
  validate,
  test: /./,
  minLength: 8,
  maxLength: 255,
  required: true,
};

export default function TeacherForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,

    cancel,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      {teacherProps.map(prop => (
        <PropertyField
          form={form}
          property={prop}
          key={prop.name}
        />
      ))}
      <PropertyField
        form={form}
        property={pw}
      />
      <PropertyField
        form={form}
        property={pwConfirm}
      />
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

TeacherForm.propTypes = {
  valid: bool.isRequired,
  form: string.isRequired,
  handleSubmit: func.isRequired,
  submitting: bool.isRequired,

  cancel: func.isRequired,
};

TeacherForm.defaultProps = {
  student: null,
};
