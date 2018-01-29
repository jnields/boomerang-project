import React, { PropTypes, Component } from 'react';
import uuid from 'uuid';

export default class ChangePasswordForm extends Component {

  static get propTypes() {
    return {
      onSubmit: PropTypes.func.isRequired,
      // submitting: PropTypes.bool.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      pw1: '',
      pw2: '',
      pw2pristine: true,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      id1: uuid(),
      id2: uuid(),
    }));
  }

  render() {
    return (<form
      onSubmit={(e) => {
        e.preventDefault();
        if (this.state.pw1 !== this.state.pw2) return;
        this.props.onSubmit(this.state.pw1);
      }}
    >
      <h2>Reset Password</h2>
      <aside>Please Enter a new Password</aside>
      <div>
        <input
          type="text"
          pattern=".{8,}"
          value={this.state.pw1}
          required
          onChange={({ target: { value } }) => {
            this.setState({ pw1: value });
          }}
        />
        <input
          type="text"
          pattern=".{8,}"
          value={this.state.pw2}
          onChange={({ target: { value } }) => {
            this.setState({
              pw2: value,
            });
          }}
          onBlur={() => {
            if (this.state.pw1 && this.state.pw2) { this.setState({ pw2pristine: false }); }
          }}
        />
        <button
          type="submit"
          disabled={(() => this.state.pw1 !== this.state.pw2
                            || this.state.pw1.length)()}
        >Update Password</button>
      </div>
    </form>);
  }
}
