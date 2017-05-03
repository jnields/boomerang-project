import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import TeacherForm from '../components/teacher-form';
import { closeModal } from '../actions/modal';
import { handleSubmit, validateEmail } from '../actions/teachers';
import { PENDING, COMPLETE, ERROR } from '../actions/xhr-statuses';
import api from '../helpers/api';

const formDecorated = reduxForm(
  {
    form: 'student',
    validate: (values) => {
      if (values.password !== values.passwordConfirmation) {
        // eslint-disable-next-line
        return { password: 'passwords do not match' };
      }
      return {};
    },
    asyncValidate: (values, dispatch) => {
      dispatch(validateEmail(PENDING));
      return api.users.query({ email: values.email, $limit: 1 }).then(
        ({ body = {} }) => {
          dispatch(validateEmail(COMPLETE));
          // eslint-disable-next-line
          if (body.count) throw { email: 'email is already taken ' };
        },
        (error) => {
          dispatch(validateEmail(ERROR));
          throw error;
        },
      );
    },
    onSubmit: (values, dispatch) => dispatch(handleSubmit(values)),
  },
)(TeacherForm);

export default connect(
  state => ({ user: state.authorization.user }),
  { cancel: closeModal },
)(formDecorated);
