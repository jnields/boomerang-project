import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { logIn } from '../actions/authorization';
import LeaderForm from '../components/leader-form';

const formDecorated = reduxForm(
  {
    form: 'student',
    onSubmit: (values, dispatch) => logIn(
      values.username,
      values.password,
    )(dispatch),
  },
)(LeaderForm);

export default connect(
  state => ({ user: state.authorization.user }),
  null,
  (state, { dispatch }, ownProps) => ({
    ...ownProps,
    ...state,
    cancel: () => {
    },
    save: () => {
    },
  }),
)(formDecorated);
