import React, { Component } from 'react';
import {
  bool,
  arrayOf,
  number,
  func,
  shape,
  string,
 } from 'prop-types';

import Buttons from './buttons';
import Pagination from './pagination';
import UploadPreview from '../upload-preview';
import PropertyForm from '../../containers/property-form';
import cs from '../../helpers/join-classes';
import formatItem from '../../helpers/format-item';

import bs from '../../styles/bootstrap.scss';
import styles from '../../styles/property-list.scss';
import helperClasses from '../../styles/helpers.scss';

import {
  fieldsetShape,
  getItemFromValues,
  getValuesFromItem,
} from '../../helpers/properties';

export default class PropertyList extends Component {

  static get propTypes() {
    return {
      querying: bool.isRequired,
      deleting: bool.isRequired,
      uploading: bool.isRequired,
      items: arrayOf(shape({})).isRequired,
      count: number.isRequired,
      selectedItem: number,
      parsedItems: arrayOf(shape({})).isRequired,
      params: shape({
        $limit: number,
        $offset: number,
      }).isRequired,

      asyncValidate: func,
      asyncBlurFields: arrayOf(string),
      fieldsets: arrayOf(fieldsetShape).isRequired,

      parseError: string,

      save: func.isRequired,
      query: func.isRequired,
      update: func.isRequired,
      del: func.isRequired,
      selectItem: func.isRequired,

      clearParsed: func,
      upload: func,

      showModal: func.isRequired,
      closeModal: func.isRequired,

      showModalOnDoubleClick: bool,
    };
  }

  static get defaultProps() {
    return {
      selectedItem: null,
      clearParsed: undefined,
      upload: undefined,
      asyncBlurFields: undefined,
      asyncValidate: undefined,
      parseError: null,
      assigningGroups: false,
      showModalOnDoubleClick: false,
    };
  }

  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  componentDidMount() {
    this.goToPage(1);
  }

  get properties() {
    return this.props.fieldsets.reduce(
      (mapped, fieldset) => [...mapped, ...fieldset.properties],
      [],
    );
  }

  goToPage(i) {
    const { params, query } = this.props;
    query({
      ...params,
      $offset: (i - 1) * (params.$limit || Infinity),
    });
  }

  addItem() {
    const {
      params,
      query,
      save,
      showModal,
      closeModal,
      fieldsets,
      deleting,
      asyncBlurFields,
      asyncValidate,
    } = this.props;
    showModal({
      title: `Add ${name}`,
      content: (
        <PropertyForm
          fieldsets={fieldsets}
          cancel={closeModal}
          deleting={deleting}
          asyncBlurFields={asyncBlurFields}
          asyncValidate={asyncValidate}
          onSubmit={async (values) => {
            await save(getItemFromValues(values, this.properties));
            await query(params);
            return closeModal();
          }}
        />
      ),
    });
  }

  render() {
    const {
      // saving,
      querying,
      // updating,
      deleting,
      uploading,

      // saveError,
      // queryError,
      // updateError,
      // deleteError,
      parseError,
      // uploadError,

      items,
      count,
      selectedItem,
      parsedItems,
      params,

      fieldsets,

      selectItem,

      query,
      update,
      del,

      asyncBlurFields,
      asyncValidate,
      clearParsed,
      upload,
      showModal,
      closeModal,
      showModalOnDoubleClick,
    } = this.props;

    if (querying && items.length === 0) return null;

    const pagination = count <= (params.$limit || Infinity)
      ? null
      : <Pagination {...this.props} goToPage={this.goToPage} />;

    const itemContent = items.length === 0
      ? <h2>None Listed</h2>
      : (
        <div>
          <div className={helperClasses.scrollBox}>
            <table
              className={[
                bs.table,
                bs.tableHover,
              ].join(' ')}
            >
              <thead>
                <tr>
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
                    className={cs({
                      [helperClasses.pointer]: true,
                      [styles.selected]: showModalOnDoubleClick && selectedItem === item.id,
                    })}
                    onClick={() => {
                      selectItem(item);
                      if (showModalOnDoubleClick && selectedItem !== item.id) {
                        return false;
                      }
                      const initialValues = getValuesFromItem(item, this.properties);
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
                            asyncBlurFields={asyncBlurFields}
                            asyncValidate={
                              async (values, dispatch) =>
                              (asyncValidate
                                ? asyncValidate(values, dispatch, initialValues)
                                : null)
                            }
                            initialValues={initialValues}
                            onSubmit={async (values) => {
                              await update(
                                item.id,
                                getItemFromValues(values, this.properties),
                              );
                              return closeModal();
                            }}
                          />
                        ),
                      });
                      return false;
                    }}
                  >
                    {this.properties.map(prop => (
                      <td key={prop.name}>
                        {formatItem(prop.getValue ? prop.getValue(item) : item[prop.name])}
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
    return (
      <div className={styles.default}>
        <div className={bs.row}>
          <div className={bs.colSm12}>
            {itemContent}
          </div>
          <div className={bs.colSm12}>
            <Buttons {...this.props} addItem={this.addItem} />
          </div>
          { parsedItems.length === 0 ? null : (
            <div className={bs.colSm12}>
              <UploadPreview
                items={parsedItems}
                isSaving={uploading}
                query={query}
                querying={querying}
                params={params}
                cancel={clearParsed}
                fieldsets={fieldsets}
                save={upload}
              />
            </div>
          )}
        </div>
        { parseError == null ? null : (
          <div className={bs.row}>
            <div className={bs.colSm12}>
              <div
                style={{ marginTop: 28, padding: '15px 20px' }}
                className={[
                  bs.alert,
                  bs.alertDanger,
                ].join(' ')}
              >
                Error reading spreadsheet.
                Make sure file is a ‘.xlsx’ file and column names are in the first row.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
