import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import LeaderTab from '../components/leader-tab';
import { user } from '../helpers/schema';
import { goToPage, selectLeader, clearUploaded, parseFile, saveUploaded } from '../actions/leaders';
import { showModal } from '../actions/modal';

export default connect(
  (state) => {
    const slice = state.leaders;
    return {
      uploading: slice.uploading,
      uploaded: slice.uploaded,
      uploadError: slice.uploadError,
      savingUploaded: slice.savingUploaded,
      pageLength: slice.query.$limit,
      leaders: denormalize(
        slice.items,
        [user],
        state.entities,
      ),
      itemCount: slice.count,
      offset: slice.query.$offset,
      query: slice.query,
    };
  },
  { selectLeader, showModal, goToPage, parseFile, clearUploaded, saveUploaded },
)(LeaderTab);
