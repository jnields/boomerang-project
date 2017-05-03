import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import TeacherList from '../components/teacher-list';
import { user } from '../helpers/schema';
import { goToPage } from '../actions/teachers';
import { showModal } from '../actions/modal';

export default connect(
  (state) => {
    const slice = state.teachers;
    return {
      pageLength: slice.query.$limit,
      teachers: denormalize(
        slice.items,
        [user],
        state.entities,
      ),
      itemCount: slice.count,
      offset: slice.query.$offset,
    };
  },
  { showModal, goToPage },
)(TeacherList);
