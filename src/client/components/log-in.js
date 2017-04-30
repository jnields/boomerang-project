import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import bs from '../styles/bootstrap';
import fa from '../styles/font-awesome';
import styles from '../styles/log-in';

export default class LogIn extends Component {
  static get propTypes() {
    const { func, bool, string, number } = PropTypes;
    return {
      valid: bool.isRequired,
      form: string.isRequired,
      handleSubmit: func.isRequired,
      submitting: bool.isRequired,
      user: number,
    };
  }

  static get defaultProps() {
    return {
      user: null,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && (this.props.user !== nextProps.user)) {
      this.setState({ redirect: '/' });
    }
  }
  render() {
    if (this.state.redirect != null) {
      return <Redirect to={this.state.redirect} />;
    }
    const { handleSubmit, submitting, form, valid } = this.props;
    return (
      <div className={styles.default}>
        <h2 className={bs.textCenter}>
        Please Log in to Continue
      </h2>
        <form onSubmit={handleSubmit} className={bs.formHorizontal}>
          <div className={bs.formGroup}>
            <label className={[bs.controlLabel, bs.colSm2].join(' ')} htmlFor={`${form}-un`}>
            Username:
           </label>
            <div className={bs.colSm10}>
              <Field
                name="username"
                id={`${form}-un`}
                component="input"
                type="text"
                validate={value => (value ? undefined : 'required')}
                className={bs.formControl}
              />
            </div>
          </div>
          <div className={bs.formGroup}>
            <label
              className={[bs.controlLabel, bs.colSm2].join(' ')}
              htmlFor={`${form}-pw`}
            >
            Password:
          </label>
            <div className={bs.colSm10}>
              <Field
                name="password"
                id={`${form}-pw`}
                component="input"
                type="password"
                validate={value => (value ? undefined : 'required')}
                className={bs.formControl}
              />
            </div>
          </div>
          <div className={bs.formGroup}>
            <div className={[bs.colSmOffset2, bs.colSm10].join(' ')}>
              <button
                type="submit"
                className={[bs.btn, bs.btnDefault].join(' ')}
                disabled={submitting || !valid}
              >
                {
                  !submitting ? null
                  : <i
                    className={[
                      fa.fa,
                      fa.faSpin,
                      fa.faSpinner,
                      styles.spinner,
                    ].join(' ')}
                  />
                }
                Submit
            </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
