import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import SchoolList from '../components/school-list';
import { school } from '../helpers/schema';
import { goToPage, selectSchool } from '../actions/schools';
import { showModal } from '../actions/modal';

export default connect(
  (state) => {
    const slice = state.schools;
    return {
      pageLength: slice.query.$limit,
      schools: denormalize(
        slice.items,
        [school],
        state.entities,
      ),
      itemCount: slice.count,
      offset: slice.query.$offset,
    };
  },
  { showModal, goToPage, selectSchool },
)(SchoolList);
