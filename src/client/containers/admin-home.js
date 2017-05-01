import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { school } from '../helpers/schema';
import { showModal } from '../actions/modal';
import { goToPage } from '../actions/schools';
import AdminHome from '../components/admin-home';

export default connect(
  state => ({
    pageLength: state.schools.query.$limit,
    schools: denormalize(
      state.schools.items,
      [school],
      state.entities,
    ),
    itemCount: state.schools.count,
    offset: state.schools.query.$offset,
    query: state.schools.query,
  }),
  { goToPage, showModal },
)(AdminHome);
