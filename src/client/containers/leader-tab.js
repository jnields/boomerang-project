import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import LeaderTab from '../components/leader-tab';
import { user } from '../helpers/schema';
import { query } from '../actions/tabs';

export default connect(
  (state) => {
    const meta = state.tabs.meta.Leaders;
    return {
      pageLength: meta.query.$limit,
      leaders: denormalize(
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
)(LeaderTab);
