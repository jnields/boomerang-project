import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { group } from '../helpers/schema';
import * as actions from '../actions/groups';

export default connect(
  state => ({
    ...state.lists.groups,
    items: denormalize(
      state.lists.groups.items,
      [group],
      state.entities,
    ),
  }),
  actions,
)(PropertyList);
