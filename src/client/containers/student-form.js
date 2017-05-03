import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import StudentForm from '../components/student-form';

import { user } from '../helpers/schema';
import { closeModal } from '../actions/modal';
import { getValues, handleSubmit, deleteStudent } from '../actions/students';

const formDecorated = reduxForm(
  {
    form: 'student',
    onSubmit: (values, dispatch) => dispatch(handleSubmit(values)),
  },
)(StudentForm);

export default connect(
  state => ({
    initialValues: getValues(denormalize(
      state.students.selectedStudent,
      user,
      state.entities,
    )),
    deleting: state.students.deleting,
    deletable: !!state.students.selectedStudent,
  }),
  {
    cancel: closeModal,
    delete: deleteStudent,
  },
)(formDecorated);
