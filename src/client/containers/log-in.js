import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { logIn } from '../actions/authorization';
import LogIn from '../components/log-in';

const formDecorated = reduxForm(
  {
    form: 'login',
    onSubmit: (values, dispatch) => {
      dispatch(logIn(values.username, values.password));
    },
  },
)(LogIn);

export default connect(
  state => ({ user: state.authorization.user }),
  null,
)(formDecorated);
