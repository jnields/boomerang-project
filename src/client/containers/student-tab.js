import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import StudentTab from '../components/student-tab';
import { user } from '../helpers/schema';
import { goToPage, selectItem } from '../actions/tabs';
import { showModal } from '../actions/modal';

export default connect(
  (state) => {
    const meta = state.tabs.meta.Students;
    return {
      pageLength: meta.query.$limit,
      students: denormalize(
        meta.items,
        [user],
        state.entities,
      ),
      itemCount: meta.count,
      offset: meta.query.$offset,
      query: meta.query,
    };
  },
  { selectItem, showModal, goToPage },
)(StudentTab);
