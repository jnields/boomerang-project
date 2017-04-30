import React from 'react';
import {
  string, bool, func,
} from 'prop-types';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';

import {
  leader as leaderProps,
  address as addressProps,
} from '../helpers/properties';

export default function LeaderForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,

    cancel,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      {leaderProps.map(prop => (
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

LeaderForm.propTypes = {
  valid: bool.isRequired,
  form: string.isRequired,
  handleSubmit: func.isRequired,
  submitting: bool.isRequired,

  cancel: func.isRequired,
};

LeaderForm.defaultProps = {
  student: null,
};
