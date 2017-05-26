import React, { Component } from 'react';
import { shape, func, string, number } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Spinner from './spinner';
import bs from '../styles/bootstrap';
import styles from '../styles/reset';
import cs from '../helpers/join-classes';

export default class Reset extends Component {

  static get propTypes() {
    return {
      user: number,
      match: shape({
        params: shape({
          resetId: string.isRequired,
        }).isRequired,
      }).isRequired,
      resetPassword: func.isRequired,
    };
  }

  static get defaultProps() {
    return { user: null };
  }

  constructor(props) {
    super(props);
    this.state = {
      pw1: '',
      pw2: '',
      pw1valid: false,
      pw2valid: false,
    };
  }

  render() {
    if (this.props.user != null) {
      return <Redirect to="/" />;
    }

    const thus = this;
    const {
      resetPassword,
      match: { params: { resetId } },
    } = this.props;

    const form = (
      <form
        className={[bs.formHorizontal].join(' ')}
        onSubmit={async (e) => {
          e.preventDefault();
          const { pw1: password } = thus.state;
          try {
            thus.setState({ pending: true });
            const { response: { statusCode } } = await resetPassword({ resetId, password });
            if (statusCode < 400) {
              thus.setState({ reset: true });
            } else {
              thus.setState({ expired: true });
            }
          } catch (error) {
            thus.setState({ error: true });
          }
        }}
      >
        <div
          className={cs({
            [bs.formGroup]: true,
            [bs.hasFeedback]: true,
            [bs.hasError]: this.state.pw1touched && !this.state.pw1valid && !this.state.pw1focus,
            [bs.hasSuccess]: this.state.pw1valid,
          })}
        >
          <div className={bs.colSm12}>
            <span className={[bs.helpBlock, bs.textMuted].join(' ')}>
              Password must be at least 8 characters long
            </span>
          </div>
          <div className={bs.colSm12}>
            <input
              onFocus={() => this.setState({ pw1focus: true })}
              onBlur={() => this.setState({ pw1focus: false })}
              onChange={(e) => {
                const pw1 = e.target.value;
                const pw2 = this.state.pw2;
                this.setState({
                  pw1,
                  pw1valid: pw1.length >= 8,
                  pw2valid: pw2 && pw1 === pw2,
                  pw1touched: true,
                });
              }}
              className={bs.formControl}
              type="password"
              placeholder="enter a new password"
              value={this.state.pw1}
            />
            <span
              className={cs({
                [bs.glyphicon]: true,
                [bs.glyphiconOk]: true,
                [bs.formControlFeedback]: true,
                [bs.hidden]: !this.state.pw1valid,
              })}
            />
          </div>
        </div>
        <div
          className={cs({
            [bs.formGroup]: true,
            [`${bs.hasSuccess} ${bs.hasFeedback}`]: this.state.pw2valid,
            [`${bs.hasError} ${bs.hasFeedback}`]: this.state.pw2touched
              && !this.state.pw2valid
              && !this.state.pw2focus,
          })}
        >
          <div className={bs.colSm12}>
            <input
              className={bs.formControl}
              onChange={(e) => {
                const pw2 = e.target.value;
                const pw1 = this.state.pw1;
                this.setState({
                  pw2,
                  pw2valid: pw2 && pw1 === pw2,
                  pw2touched: true,
                });
              }}
              onBlur={() => this.setState({ pw2focus: false })}
              onFocus={() => this.setState({ pw2focus: true })}
              type="password"
              placeholder="confirm"
              value={this.state.pw2}
            />
            <span
              className={cs({
                [bs.glyphicon]: true,
                [bs.glyphiconOk]: true,
                [bs.formControlFeedback]: true,
                [bs.hidden]: !this.state.pw2valid,
              })}
            />
          </div>
        </div>
        <div className={bs.formGroup}>
          <div className={bs.colSm12}>
            <button
              className={[bs.btn, bs.btnDefault].join(' ')}
              type="submit"
              disabled={!this.state.pw1valid || !this.state.pw2valid}
            >
              { this.state.pending ? <Spinner /> : 'Submit' }
            </button>
          </div>
        </div>
      </form>
    );
    const resetSuccess = (
      <div>
        <h2>Password successfully reset</h2>
        <Link to="/">Continue</Link>
      </div>
    );
    const expired = (
      <div>
        <h2>Password Not Changed</h2>
        <p>
          Whoops! Looks like this link has expired.
        </p>
        <p>
          Vists <Link to="/reset">here</Link> to request a new link.
        </p>
      </div>
    );
    const content = (() => {
      if (this.state.reset) {
        return resetSuccess;
      } else if (this.state.expired) {
        return expired;
      }
      return form;
    })();

    return (
      <div className={styles.default}>
        <h1>Password Reset</h1>
        {content}
      </div>
    );
  }
}
