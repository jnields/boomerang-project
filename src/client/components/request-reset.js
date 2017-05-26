import React, { Component } from 'react';
import { func, number } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import styles from '../styles/request-reset';
import bs from '../styles/bootstrap';
import emailPattern from '../helpers/email-pattern';

export default class ResetPasswordForm extends Component {

  static get propTypes() {
    return {
      requestReset: func.isRequired,
      user: number,
    };
  }

  static get defaultProps() {
    return { user: null };
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  render() {
    if (this.props.user != null) {
      return <Redirect to="/" />;
    }

    const form = (
      <form
        className={bs.formHorizontal}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await this.props.requestReset(this.state.email);
            this.setState({ submitted: true });
          } catch (error) {
            this.setState({ submitted: true, error });
          }
        }}
      >
        <h2>
          Reset Password <br />
          <small>Follow these steps to recover your password</small>
        </h2>
        <ol className={bs.lead}>
          <li>Enter your registered e-mail address</li>
          <li>Wait for a recovery email</li>
          <li>Follow instructions to reset your password</li>
        </ol>
        <div className={bs.formGroup}>
          <div className={bs.colSm12}>
            <input
              className={bs.formControl}
              type="text"
              placeholder="your e-mail"
              value={this.state.email}
              onChange={({ target: { value } }) => {
                this.setState({
                  email: value,
                  valid: emailPattern.test(value),
                });
              }}
            />
          </div>
        </div>
        <div className={bs.formGroup}>
          <div className={bs.colSm12}>
            <button
              className={[
                bs.btn, bs.btnDefault,
              ].join(' ')}
              disabled={!this.state.valid}
              type="submit"
            >
              Get New Password
            </button>
          </div>
        </div>
        <Link to="/login">Return to Login Page</Link>
      </form>
    );
    const submitted = (
      <div>
        <h2>Request Received</h2>
        <p className={bs.lead}>
          Check your email for a link to reset your password.
          If it doesn’t appear within a few minutes, check your spam folder.
        </p>
        <Link to="/login">Return to Login</Link>
      </div>
    );

    return (
      <div className={styles.default}>
        {this.state.submitted ? submitted : form }
      </div>
    );
  }
}
