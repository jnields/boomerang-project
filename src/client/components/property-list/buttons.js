import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import Spinner from '../spinner';
import bs from '../../styles/bootstrap';

export default class Buttons extends Component {
  static get propTypes() {
    return {
      addItem: func.isRequired,
      parsing: bool.isRequired,
      assigningGroups: bool.isRequired,
      uploading: bool.isRequired,
      parse: func,
      assignGroups: func,
      upload: func,
      clearParsed: func,
    };
  }
  static get defaultProps() {
    return {
      parse: null,
      assignGroups: null,
      upload: null,
      clearParsed: null,
    };
  }

  constructor(props) {
    super(props);
    this.state = { fileId: null };
  }

  componentWillMount() {
    if (window !== undefined) {
      const u8 = new Uint8Array(16);
      window.crypto.getRandomValues(u8);
      const fileId = window.btoa(String.fromCharCode.apply(null, u8));
      this.setState({ fileId });
    }
  }

  render() {
    const {
      addItem,
      assignGroups,
      assigningGroups,
      parse,
      upload,
      clearParsed,
      uploading,
      parsing,
    } = this.props;
    const anyPending = parsing || uploading || assigningGroups;
    const assignButton = assignGroups == null ? null : (
      <button
        disabled={anyPending}
        onClick={() => assignGroups()}
        className={[
          bs.btn, bs.btnDefault, bs.pullRight,
        ].join(' ')}
      >
        {assigningGroups ?
          [<Spinner key={1} />, <span key={2}>Please wait…</span>]
          : 'Assign Students to Groups'
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
      </div>
    );
  }
}
