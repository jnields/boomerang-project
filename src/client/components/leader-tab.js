import React, { Component } from 'react';
import { bool, arrayOf, number, func, shape } from 'prop-types';

import Spinner from './spinner';
import Paginator from './paginator';
import UploadPreview from './upload-preview';
import LeaderForm from '../containers/leader-form';

import {
  leader as leaderProperties,
  address as addressProperties,
} from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import { user } from '../helpers/models';

export default class LeaderTab extends Component {

  componentDidMount() {
    this.props.goToPage(1);
  }

  render() {
    const {
      uploading,
      itemCount,
      offset,
      leaders,
      pageLength,
      goToPage,
      showModal,
      parseFile,
      uploaded,
      saveUploaded,
      selectLeader,
    } = this.props;
    const pagination = itemCount <= pageLength
      ? null
      : (
        <div className={[bs.textCenter].join(' ')}>
          <Paginator
            length={5}
            currentPage={1 + (offset / pageLength)}
            totalPages={Math.ceil(itemCount / pageLength)}
            goToPage={goToPage}
          />
        </div>
      );
    const leaderContent = leaders.length === 0
      ? <h2>No Leaders Listed</h2>
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
                  {leaderProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                    ))}
                  {addressProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {leaders.map(item => (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <tr
                    key={item.id}
                    className={styles.pointer}
                    onClick={() => selectLeader(item)}
                  >
                    <td>{(item.group || {}).name}</td>
                    {leaderProperties.map(prop => (
                      <td key={prop.name}>{item[prop.name]}</td>
                      ))}
                    {addressProperties.map(prop => (
                      <td key={prop.name}>{(item.address || {})[prop.name]}</td>
                      ))}
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {pagination}
        </div>
      );
    const buttons = (
      <div className={bs.btnToolbar}>
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          onClick={() => showModal({
            title: 'Add Leader',
            content: <LeaderForm />,
          })}
        >
          <span
            className={[
              bs.glyphicon,
              bs.glyphiconPlus,
            ].join(' ')}
          /> Add
        </button>
        <label
          htmlFor="student.file"
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          style={{ cursor: 'pointer', marginBottom: 0 }}
        >
          {
            uploading
              ? <Spinner />
              : <span
                className={[
                  bs.glyphicon,
                  bs.glyphiconUpload,
                ].join(' ')}
              />
          }
          {uploading ? ' uploading…' : ' Upload via Excel File'}
          <input
            id="student.file"
            style={{ display: 'none' }}
            type="file"
            accept=".xlsx"
            ref={() => {}}
            onChange={parseFile}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
        </label>
      </div>
    );
    return (
      <div className={bs.row}>
        <div className={bs.colSm12}>
          {leaderContent}
        </div>
        <div className={bs.colSm12}>
          {buttons}
        </div>
        { uploaded.length === 0 ? null : (
          <div className={bs.colSm12}>
            <UploadPreview
              items={uploaded}
              isSaving={this.props.savingUploaded}
              cancel={this.props.clearUploaded}
              properties={[...leaderProperties, ...addressProperties]}
              save={saveUploaded}
            />
          </div>
        )}
      </div>
    );
  }
}

LeaderTab.propTypes = {
  uploading: bool.isRequired,
  savingUploaded: bool.isRequired,
  pageLength: number.isRequired,
  leaders: arrayOf(user).isRequired,
  uploaded: arrayOf(shape({})).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
  showModal: func.isRequired,
  parseFile: func.isRequired,
  clearUploaded: func.isRequired,
  saveUploaded: func.isRequired,
  selectLeader: func.isRequired,
};
