import React, { Component } from 'react';
import {
  bool,
  arrayOf,
  number,
  func,
  shape,
  // string,
 } from 'prop-types';

import Spinner from './spinner';
import Paginator from './paginator';
import UploadPreview from './upload-preview';
import PropertyForm from '../containers/property-form';

import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import {
  fieldsetShape,
  getItemFromValues,
  getValuesFromItem,
} from '../helpers/properties';

export default class PropertyList extends Component {

  static get propTypes() {
    return {
      // saving: bool.isRequired,
      querying: bool.isRequired,
      // updating: bool.isRequired,
      deleting: bool.isRequired,
      parsing: bool.isRequired,
      uploading: bool.isRequired,

      // saveError: string,
      // queryError: string,
      // updateError: string,
      // deleteError: string,
      // parseError: string,
      // uploadError: string,

      items: arrayOf(shape({})).isRequired,
      count: number.isRequired,
      // selectedItem: shape({ id: number.isRequired }),
      parsedItems: arrayOf(shape({})).isRequired,
      params: shape({
        $limit: number,
        $offset: number,
      }).isRequired,

      fieldsets: arrayOf(fieldsetShape).isRequired,

      save: func.isRequired,
      query: func.isRequired,
      update: func.isRequired,
      del: func.isRequired,
      selectItem: func.isRequired,

      parse: func,
      clearParsed: func,
      upload: func,

      showModal: func.isRequired,
      closeModal: func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      selectedItem: null,
      parse: undefined,
      clearParsed: undefined,
      upload: undefined,
    };
  }

  constructor(props) {
    super(props);
    const {
      params,
      query,
      save,
      showModal,
      closeModal,
      fieldsets,
      deleting,
    } = props;
    this.properties = fieldsets.reduce(
      (mapped, fieldset) => [...mapped, ...fieldset.properties],
      [],
    );
    this.state = { fileId: null };
    this.goToPage = i => query({
      ...params,
      $offset: (i - 1) * (params.$limit || Infinity),
    });
    this.addItem = () => {
      showModal({
        title: `Add ${name}`,
        content: (
          <PropertyForm
            fieldsets={fieldsets}
            cancel={closeModal}
            deleting={deleting}
            onSubmit={async (values) => {
              await save(getItemFromValues(values, this.properties));
              await query(params);
              return closeModal();
            }}
          />
        ),
      });
    };
  }

  componentDidMount() {
    this.goToPage(1);
    const u8 = new Uint8Array(16);
    window.crypto.getRandomValues(u8);
    const fileId = window.btoa(String.fromCharCode.apply(null, u8));
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ fileId });
  }

  render() {
    const {
      // saving,
      querying,
      // updating,
      deleting,
      parsing,
      uploading,

      // saveError,
      // queryError,
      // updateError,
      // deleteError,
      // parseError,
      // uploadError,

      items,
      count,
      // selectedItem,
      parsedItems,
      params,

      fieldsets,

      selectItem,

      query,
      update,
      del,

      parse,
      clearParsed,
      upload,
      showModal,
      closeModal,
    } = this.props;
    if (querying && items.length === 0) return null;

    const pagination = count <= (params.$limit || Infinity)
      ? null
      : (
        <div className={[bs.textCenter].join(' ')}>
          <Paginator
            length={5}
            currentPage={1 + ((params.$offset || 0) / params.$limit)}
            totalPages={Math.ceil(count / params.$limit)}
            goToPage={this.goToPage}
          />
        </div>
      );

    const itemContent = items.length === 0
      ? <h2>None Listed</h2>
      : (
        <div>
          <div className={styles.scrollBox}>
            <table
              className={[
                bs.table,
                bs.tableHover,
              ].join(' ')}
            >
              <thead>
                <tr>
                  <th>Group</th>
                  {this.properties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <tr
                    key={item.id}
                    className={styles.pointer}
                    onClick={() => {
                      selectItem(item);
                      showModal({
                        title: `Edit: ${name}`,
                        content: (
                          <PropertyForm
                            del={async () => {
                              await del(item.id);
                              await query(params);
                              return closeModal();
                            }}
                            deleting={deleting}
                            fieldsets={fieldsets}
                            cancel={closeModal}
                            initialValues={getValuesFromItem(item, this.properties)}
                            onSubmit={async (values) => {
                              await update(getItemFromValues(values));
                              return closeModal();
                            }}
                          />
                        ),
                      });
                    }}
                  >
                    {this.properties.map(prop => (
                      <td key={prop.name}>
                        {prop.getValue ? prop.getValue(item) : item[prop.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination}
        </div>
      );

    const canUpload = (parse && upload && clearParsed);
    const uploadButton = !canUpload
      ? null
      : (
        <label
          htmlFor={this.state.fileId}
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          disabled={uploading || parsing}
          style={{ cursor: 'pointer', marginBottom: 0 }}
        >
          {
            parsing
              ? <Spinner />
              : <span
                className={[
                  bs.glyphicon,
                  bs.glyphiconUpload,
                ].join(' ')}
              />
          }
          {parsing ? ' reading file…' : ' Upload via Excel File'}
          <input
            id={this.state.fileId}
            style={{ display: 'none' }}
            type="file"
            accept=".xlsx"
            disabled={uploading || parsing}
            ref={() => {}}
            onChange={e => parse(e.target.files)}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
        </label>
    );
    const buttons = (
      <div className={bs.btnToolbar}>
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          onClick={this.addItem}
        >
          <span
            className={[
              bs.glyphicon,
              bs.glyphiconPlus,
            ].join(' ')}
          /> Add
        </button>
        {uploadButton}
      </div>
    );

    return (
      <div className={bs.row}>
        <div className={bs.colSm12}>
          {itemContent}
        </div>
        <div className={bs.colSm12}>
          {buttons}
        </div>
        { parsedItems.length === 0 ? null : (
          <div className={bs.colSm12}>
            <UploadPreview
              items={parsedItems}
              isSaving={uploading}
              cancel={clearParsed}
              fieldsets={fieldsets}
              save={upload}
            />
          </div>
        )}
      </div>
    );
  }
}
