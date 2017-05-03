import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import GroupTab from '../components/group-tab';
import * as actions from '../actions/groups';
import { showModal } from '../actions/modal';
import { group } from '../helpers/schema';

export default connect(
  state => ({
    ...state.groups,
    groups: denormalize(
      state.groups.groups,
      [group],
      state.entities,
    ),
  }),
  {
    ...actions,
    showModal,
  },
)(GroupTab);
