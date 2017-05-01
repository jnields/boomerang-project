import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import StudentForm from '../components/student-form';
import { closeModal } from '../actions/modal';
import { saveStudent } from '../actions/students';

const formDecorated = reduxForm(
  {
    form: 'student',
    onSubmit: (values, dispatch) => saveStudent(values)(dispatch),
  },
)(StudentForm);

export default connect(
  state => ({ user: state.authorization.user }),
  { cancel: closeModal },
)(formDecorated);
