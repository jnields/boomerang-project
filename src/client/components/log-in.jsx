import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import bs from '../styles/bootstrap.scss';
import fa from '../styles/font-awesome/index.scss';
import styles from '../styles/log-in.scss';

export default class LogIn extends Component {
  static get propTypes() {
    const { func, bool, string, number } = PropTypes;
    return {
      valid: bool.isRequired,
      form: string.isRequired,
      handleSubmit: func.isRequired,
      submitting: bool.isRequired,
      user: number,
      logInFailed: bool.isRequired,
      resetAuth: func.isRequired,
    };
  }

  static get defaultProps() {
    return { user: null };
  }

  componentWillMount() {
    this.props.resetAuth();
  }

  render() {
    if (this.props.user != null) {
      return <Redirect to="/" />;
    }
    const { handleSubmit, submitting, form, valid, logInFailed } = this.props;
    return (
      <div className={styles.default}>
        <h2 className={bs.textCenter}>
          Please Log in to Continue
        </h2>
        <div
          style={{ display: logInFailed ? undefined : 'none' }}
          className={[bs.colSmOffset2, bs.colSm10].join(' ')}
        >
          <span
            className={[bs.helpBlock].join(' ')}
          >
            { 'Incorrect username or password'}
          </span>
        </div>
        <form onSubmit={handleSubmit} className={bs.formHorizontal}>
          <div className={bs.formGroup}>
            <label className={[bs.controlLabel, bs.colSm2].join(' ')} htmlFor={`${form}-un`}>
            Email:
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
              <Link to="/reset">
                Forgot password?
              </Link>
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
