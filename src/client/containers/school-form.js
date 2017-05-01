import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import SchoolForm from '../components/school-form';
import { closeModal } from '../actions/modal';
import { onSubmit, goToPage } from '../actions/schools';

const formDecorated = reduxForm(
  {
    form: 'school',
  },
)(SchoolForm);

export default connect(
  null,
  {
    cancel: closeModal,
    goToPage,
    onSubmit,
  },
)(formDecorated);
