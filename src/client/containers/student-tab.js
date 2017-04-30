import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import StudentTab from '../components/student-tab';
import { user } from '../helpers/schema';
import { query } from '../actions/tabs';

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
  null,
  (state, { dispatch }, ownProps) => ({
    ...ownProps,
    ...state,
    goToPage: (page) => {
      dispatch(query({
        ...state.query,
        $offset: state.query.$limit * (page - 1),
      }));
    },
  }),
)(StudentTab);
