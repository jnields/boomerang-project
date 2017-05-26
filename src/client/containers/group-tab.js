import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { group } from '../helpers/schema';
import * as actions from '../actions/groups';
import api from '../helpers/api';

export default connect(
  state => ({
    ...state.lists.groups,
    items: denormalize(
      state.lists.groups.items,
      [group],
      state.entities,
    ),
    asyncBlurFields: ['name'],
    asyncValidate: async (values, dispatch, initialValues) => {
      if (values.name) {
        if (initialValues && initialValues.name === values.name) return;
        const { body: { count } } = (await api.groups.query({ name: values.name }));
        // eslint-disable-next-line no-throw-literal
        if (count) throw { name: 'Group name must be unique ' };
      }
    },
  }),
  actions,
)(PropertyList);
