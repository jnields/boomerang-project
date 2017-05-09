import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { school } from '../helpers/schema';
// import { showModal } from '../actions/modal';
import { query as queryTeachers } from '../actions/teachers';
import AdminHome from '../components/admin-home';

export default connect(
  state => ({
    selectedSchool: denormalize(
      state.lists.schools.selectedItem,
      school,
      state.entities,
    ),
    teacherParams: state.lists.teachers.params,
  }),
  { queryTeachers },
)(AdminHome);
