import React, { Component } from 'react';
import { node, bool, func, arrayOf, shape, string } from 'prop-types';
import Spinner from '../spinner';
import styles from '../../styles/report';
import getQuery from '../../helpers/get-reports-query';
import bs from '../../styles/bootstrap';
import helpers from '../../styles/helpers';

export default class ReportBase extends Component {

  static get propTypes() {
    return {
      children: node.isRequired,
      loading: bool.isRequired,
      items: arrayOf(shape({})),
      loadReport: func.isRequired,
      location: shape({
        pathname: string.isRequired,
      }).isRequired,
    };
  }

  static get defaultProps() {
    return { items: null };
  }

  componentWillMount() {
    if (browser) {
      this.props.loadReport(getQuery(this.props.location.pathname));
    }
  }

  render() {
    const {
      children,
      loading,
      items,
    } = this.props;
    if (loading || items == null) {
      return (
        <div className={styles.wrapper}>
          <Spinner
            className={[
              styles.spinner,
              helpers.secondaryColor,
            ].join(' ')}
          />
        </div>
      );
    }
    return (
      <div>
        <div
          style={{ marginTop: 28 }}
          className={[
            bs.clearfix,
            bs.hiddenPrint,
          ].join(' ')}
        >
          <button
            onClick={() => history.back()}
            className={[
              bs.hiddenPrint,
              bs.btn, bs.btnLg, bs.btnDefault,
              bs.pullLeft,
            ].join(' ')}
          >
            <span
              className={[
                bs.glyphicon,
                bs.glyphiconArrowLeft,
              ].join(' ')}
            /> Back
        </button>
          <button
            onClick={print}
            className={[
              bs.hiddenPrint,
              bs.btn, bs.btnLg, bs.btnDefault,
              bs.pullRight,
            ].join(' ')}
          >
            <span
              className={[
                bs.glyphicon,
                bs.glyphiconPrint,
              ].join(' ')}
            /> Print
        </button>
        </div>
        {children}
      </div>
    );
  }
}
