import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { logIn, resetAuth } from '../actions/authorization';
import LogIn from '../components/log-in';

const formDecorated = reduxForm(
  {
    form: 'login',
    onSubmit: (values, dispatch) => logIn(
      values.username,
      values.password,
    )(dispatch),
  },
)(LogIn);

export default connect(
  state => (state.authorization),
  { resetAuth },
)(formDecorated);
