import React from 'react';
import {
  string, bool, func,
} from 'prop-types';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';
import groupName from '../helpers/properties/group-name';

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
    deleting,
    delete: del,
    deletable,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      <fieldset>
        <legend>Group</legend>
        <PropertyField
          valid
          form={form}
          property={groupName}
        />
      </fieldset>
      <fieldset>
        <legend>Info</legend>
        {leaderProps.map(prop => (
          <PropertyField
            valid
            form="student"
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
            form="student"
            property={prop}
            key={prop.name}
          />
        ))}
      </fieldset>
      <div className={bs.formGroup}>
        <div className={[bs.colSm9, bs.colSmOffset3].join(' ')}>
          <div className={bs.btnToolbar}>
            { !deletable ? null : (
              <button
                type="button"
                disabled={submitting || deleting}
                className={[bs.btn, bs.btnDanger].join(' ')}
                tabIndex={-1}
                onClick={del}
              >
                {deleting ? <Spinner /> : <span
                  className={[
                    bs.glyphicon,
                    bs.glyphiconTrash,
                  ].join(' ')}
                />}
                {deleting ? ' …deleting' : ' Delete'}
              </button>
            )}
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
              disabled={!valid || submitting || deleting}
            >
              { submitting ? <Spinner /> : null }
              { submitting ? ' …saving' : ' Save' }
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
  deleting: bool.isRequired,
  deletable: bool.isRequired,
  cancel: func.isRequired,
  delete: func.isRequired,
};
