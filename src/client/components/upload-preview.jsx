import React from 'react';
import { arrayOf, func, bool, shape, number } from 'prop-types';
import { fieldsetShape } from '../helpers/properties';
import formatItem from '../helpers/format-item';
import bs from '../styles/bootstrap.scss';
import styles from '../styles/helpers.scss';

import Spinner from './spinner';

export default function UploadPreview({
  items,
  fieldsets,
  isSaving,
  save,
  cancel,
  query,
  params,
  querying,
}) {
  const properties = fieldsets.reduce(
    (mapped, fieldset) => [...mapped, ...fieldset.properties],
    [],
  );
  return (
    <div>
      <h3>Preview:</h3>
      <div
        className={styles.scrollBox}
        style={{ maxHeight: '50vh', marginBottom: 10 }}
      >
        <table className={bs.table}>
          <thead>
            <tr>
              {properties.map(prop => (
                <th key={prop.name}>
                  {prop.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, ix) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={ix}>
                {properties.map(prop => (
                  <td key={prop.name}>
                    {formatItem(
                      (prop.getValue ? prop.getValue(item) : item[prop.name]),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={bs.btnToolbar}>
        <button
          className={[bs.btn, bs.btnDefault].join(' ')}
          onClick={cancel}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          className={[bs.btn, bs.btnPrimary].join(' ')}
          onClick={async () => {
            await save(items);
            await query(params);
          }}
          disabled={isSaving || querying}
        >
          {isSaving || querying ? <Spinner /> : null}
          Save
        </button>
      </div>
    </div>
  );
}

UploadPreview.propTypes = {
  fieldsets: arrayOf(fieldsetShape).isRequired,
  items: arrayOf(shape({})).isRequired,
  isSaving: bool.isRequired,
  save: func.isRequired,
  cancel: func.isRequired,
  params: shape({
    $limit: number,
    $offset: number,
  }).isRequired,
  querying: bool.isRequired,
  query: func.isRequired,
};
