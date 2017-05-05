import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { user } from '../helpers/schema';
import * as actions from '../actions/teachers';

export default connect(
  state => ({
    ...state.lists.teachers,
    items: denormalize(
      state.lists.teachers.items,
      [user],
      state.entities,
    ),
  }),
  actions,
)(PropertyList);
