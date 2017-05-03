import React from 'react';
import { arrayOf, func, bool, shape } from 'prop-types';
import { shape as propertyShape } from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';

import Spinner from './spinner';

export default function UploadPreview(props) {
  return (
    <div>
      <h3>Preview:</h3>
      <div className={styles.scrollBox} style={{ maxHeight: '50vh' }}>
        <table className={bs.table}>
          <thead>
            <tr>
              {props.properties.map(prop => (
                <th key={prop.name}>
                  {prop.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, ix) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={ix}>
                {props.properties.map(prop => (
                  <td key={prop.name}>
                    {item[prop.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={bs.btnToolbar}>
        <button
          className={[bs.btn, bs.btnPrimary].join(' ')}
          onClick={props.cancel}
          disabled={props.isSaving}
        >
          Cancel
        </button>
        <button
          className={[bs.btn, bs.btnDefault].join(' ')}
          onClick={() => props.save(props.items)}
          disabled={props.isSaving}
        >
          {props.isSaving ? <Spinner /> : null}
          Save
        </button>
      </div>
    </div>
  );
}

UploadPreview.propTypes = {
  properties: arrayOf(propertyShape).isRequired,
  items: arrayOf(shape({})).isRequired,
  isSaving: bool.isRequired,
  save: func.isRequired,
  cancel: func.isRequired,
};
