import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { logIn } from '../actions/authorization';
import StudentForm from '../components/student-form';

const formDecorated = reduxForm(
  {
    form: 'student',
    onSubmit: (values, dispatch) => logIn(
      values.username,
      values.password,
    )(dispatch),
  },
)(StudentForm);

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
