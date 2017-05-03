import React from 'react';
import { func, bool } from 'prop-types';
import { propTypes as formProps } from 'redux-form';

import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';

import {
  group as groupProps,
} from '../helpers/properties';

export default function GroupForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,

    cancel,
    deleting,
    deleteGroup,
    deletable,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      {groupProps.map(prop => (
        <PropertyField
          valid
          form={form}
          property={prop}
          key={prop.name}
        />
      ))}
      <div className={bs.formGroup}>
        <div className={[bs.colSmOffset3, bs.colSm9].join(' ')}>
          <div className={bs.btnToolbar}>
            { !deletable ? null : (
              <button
                type="button"
                disabled={submitting || deleting}
                className={[bs.btn, bs.btnDanger].join(' ')}
                onClick={deleteGroup}
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

GroupForm.propTypes = {
  ...formProps,
  deleting: bool.isRequired,
  deletable: bool.isRequired,
  cancel: func.isRequired,
  deleteGroup: func.isRequired,
};
