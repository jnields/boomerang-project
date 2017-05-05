import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { school } from '../helpers/schema';
// import { showModal } from '../actions/modal';
// import { goToPage, selectSchool } from '../actions/schools';
import AdminHome from '../components/admin-home';

export default connect(
  state => ({
    selectedSchool: denormalize(
      state.lists.schools.selectedItem,
      school,
      state.entities,
    ),
  }),
)(AdminHome);
