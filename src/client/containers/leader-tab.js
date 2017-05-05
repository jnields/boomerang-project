import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { user } from '../helpers/schema';
import * as actions from '../actions/leaders';

export default connect(
  state => ({
    ...state.lists.leaders,
    items: denormalize(
      state.lists.leaders.items,
      [user],
      state.entities,
    ),
  }),
  actions,
)(PropertyList);
