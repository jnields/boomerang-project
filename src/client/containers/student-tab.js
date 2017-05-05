import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { user } from '../helpers/schema';
import * as actions from '../actions/students';

export default connect(
  state => ({
    ...state.lists.students,
    items: denormalize(
      state.lists.students.items,
      [user],
      state.entities,
    ),
  }),
  actions,
)(PropertyList);
