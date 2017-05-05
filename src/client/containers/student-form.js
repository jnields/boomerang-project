import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { getValuesFromItem, student } from '../helpers/properties';

import * as actions from '../actions/students';

import PropertyForm from '../components/property-form';
import { user } from '../helpers/schema';

export default connect(
  state => ({
    ...state.lists.students,
    fieldsets: student,
    initialValues: getValuesFromItem(denormalize(
      state.lists.students.selectedItem,
      user,
      state.entities,
    )),
  }),
  actions,
)(reduxForm({ form: 'student' })(PropertyForm));
