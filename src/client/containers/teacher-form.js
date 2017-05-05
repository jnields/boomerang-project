import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropertyForm from '../components/property-form';
import * as actions from '../actions/teachers';
import api from '../helpers/api';

export default connect(
  state => ({
    ...state.lists.teachers,
  }),
  actions,
)(reduxForm({
  form: 'teacher',
  validate: (values) => {
    if (values.password !== values.passwordConfirmation) {
      // eslint-disable-next-line
      return { password: 'password does not match' };
    }
    return {};
  },
  asyncValidate: async (values) => {
    const { body } = await api.users.query({ email: values.email, $limit: 1 });
    // eslint-disable-next-line no-throw-literal
    if (body.count) throw { email: 'email is already taken ' };
  },
})(PropertyForm));
