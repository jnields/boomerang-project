import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import PropertyList from '../components/property-list';
import { school } from '../helpers/schema';
import * as actions from '../actions/schools';

export default connect(
  state => ({
    ...state.lists.schools,
    showModalOnDoubleClick: true,
    items: denormalize(
      state.lists.schools.items,
      [school],
      state.entities,
    ),
  }),
  actions,
)(PropertyList);
