import React from 'react';
import {
  string, bool, func, arrayOf,
} from 'prop-types';
import PropertyField from './property-field';
import Spinner from './spinner';

import bs from '../styles/bootstrap';
import { fieldsetShape } from '../helpers/properties';

function getProperties(form, { properties }) {
  return properties.map(prop => (
    <PropertyField
      valid
      key={prop.name}
      form={form}
      property={prop}
    />
  ));
}

function getFieldsets(form, fieldsets) {
  return fieldsets.map(fs => (
    <fieldset key={fs.key}>
      <legend>{fs.legend}</legend>
      {getProperties(form, fs)}
    </fieldset>
  ));
}

export default function PropertyForm(props) {
  const {
    form,
    valid,
    handleSubmit,
    submitting,
    cancel,
    deleting,
    del,
    fieldsets,
  } = props;
  return (
    <form className={bs.formHorizontal} onSubmit={handleSubmit}>
      { fieldsets.length === 1
          ? getProperties(form, fieldsets[0])
          : getFieldsets(form, fieldsets)
      }
      <div className={bs.formGroup}>
        <div className={[bs.colSmOffset3, bs.colSm9].join(' ')}>
          <div className={bs.btnToolbar}>
            { !del ? null : (
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
              disabled={submitting || deleting}
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

PropertyForm.propTypes = {
  valid: bool.isRequired,
  form: string.isRequired,
  handleSubmit: func.isRequired,
  submitting: bool.isRequired,
  cancel: func.isRequired,
  del: func,
  deleting: bool.isRequired,
  fieldsets: arrayOf(fieldsetShape).isRequired,
};
PropertyForm.defaultProps = {
  del: null,
};
