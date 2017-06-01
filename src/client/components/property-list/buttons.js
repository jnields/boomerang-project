import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import Spinner from '../spinner';
import bs from '../../styles/bootstrap';

export default class Buttons extends Component {
  static get propTypes() {
    return {
      addItem: func.isRequired,
      parsing: bool.isRequired,
      extraActionPending: bool.isRequired,
      uploading: bool.isRequired,
      parse: func,
      extraAction: func,
      extraActionText: string,
      upload: func,
      clearParsed: func,
      delAll: func,
      showModal: func,
      closeModal: func,
    };
  }
  static get defaultProps() {
    return {
      parse: null,
      extraAction: null,
      upload: null,
      clearParsed: null,
      extraActionText: null,
      delAll: null,
      showModal: null,
      closeModal: null,
    };
  }

  constructor(props) {
    super(props);
    this.state = { fileId: null };
  }

  componentWillMount() {
    if (browser) {
      const u8 = new Uint8Array(16);
      window.crypto.getRandomValues(u8);
      const fileId = window.btoa(String.fromCharCode.apply(null, u8));
      this.setState({ fileId });
    }
  }

  render() {
    const {
      addItem,
      extraAction,
      extraActionPending,
      extraActionText,
      parse,
      upload,
      clearParsed,
      uploading,
      parsing,
      delAll,
      showModal,
      closeModal,
    } = this.props;
    const anyPending = parsing || uploading || extraActionPending;
    const assignButton = extraAction == null ? null : (
      <button
        disabled={anyPending}
        onClick={() => extraAction()}
        className={[
          bs.btn, bs.btnDefault,
        ].join(' ')}
      >
        {extraActionPending ?
          [<Spinner key={1} />, <span key={2}>Please wait…</span>]
          : extraActionText
        }
      </button>
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
        disabled={anyPending}
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
          disabled={anyPending}
          ref={() => {}}
          onChange={e => parse(e.target.files)}
          onClick={(e) => {
            e.target.value = null;
          }}
        />
      </label>
    );

    const delAllButton = delAll && (
      <button
        disabled={anyPending}
        className={[bs.btn, bs.btnDanger, bs.pullRight].join(' ')}
        onClick={() => {
          showModal({
            title: 'Permanently delete all records?',
            content: (
              <div>
                <div className={bs.modalBody}>This action cannot be undone.</div>
                <div className={bs.modalFooter}>
                  <div
                    className={[
                      bs.btnPanel,
                      bs.textCenter,
                    ].join(' ')}
                  >
                    <button
                      className={[
                        bs.btn,
                        bs.btnPrimary,
                      ].join(' ')}
                      onClick={() => closeModal()}
                    >
                      Cancel
                    </button>
                    <button
                      tabIndex={-1}
                      style={{
                        marginLeft: '50px',
                      }}
                      onClick={() => {
                        delAll().then(closeModal);
                      }}
                      className={[
                        bs.btn,
                        bs.btnDanger,
                      ].join(' ')}
                    >
                      Delete all
                    </button>
                  </div>
                </div>
              </div>
            ),
          });
        }}
      >
        <span
          className={[
            bs.glyphicon,
            bs.glyphiconTrash,
          ].join(' ')}
        />
        {' Delete All'}
      </button>
    );
    return (
      <div className={bs.btnToolbar}>
        <button
          disabled={anyPending}
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          onClick={addItem}
        >
          <span
            className={[
              bs.glyphicon,
              bs.glyphiconPlus,
            ].join(' ')}
          /> Add
      </button>
        {uploadButton}
        {assignButton}
        {delAllButton}
      </div>
    );
  }
}
