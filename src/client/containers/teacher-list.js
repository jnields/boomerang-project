import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { user } from '../helpers/schema';
import api from '../helpers/api';
import * as actions from '../actions/teachers';

export default connect(
  state => ({
    ...state.lists.teachers,
    params: state.lists.teachers.params,
    items: denormalize(
      state.lists.teachers.items,
      [user],
      state.entities,
    ),
    asyncBlurFields: ['email'],
    asyncValidate: async (values, dispatch, initialValues) => {
      if (values.email) {
        if (initialValues && initialValues.email === values.email) return;
        const { body: { count } } = (await api.users.query({ email: values.email }));
        // eslint-disable-next-line no-throw-literal
        if (count) throw { email: 'E-mail address must be unique ' };
      }
    },
  }),
  actions,
)(PropertyList);
