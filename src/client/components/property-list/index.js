import React, { Component } from 'react';
import {
  bool,
  arrayOf,
  number,
  func,
  shape,
  // string,
 } from 'prop-types';

import Buttons from './buttons';
import Pagination from './pagination';
import UploadPreview from '../upload-preview';
import PropertyForm from '../../containers/property-form';
import cs from '../../helpers/join-classes';
import format from './format';

import bs from '../../styles/bootstrap';
import styles from '../../styles/property-list';
import helperClasses from '../../styles/helpers';

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

      fieldsets: arrayOf(fieldsetShape).isRequired,

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
      assigningGroups: false,
      showModalOnDoubleClick: false,
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

  componentWillMount() {
    if (window !== undefined) {
      this.goToPage(1);
    }
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
      // parseError,
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
          <div className={styles.scrollBox}>
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
                        {format(prop.getValue ? prop.getValue(item) : item[prop.name])}
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
      <div className={[bs.row, styles.default].join(' ')}>
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
