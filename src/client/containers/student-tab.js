import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import StudentTab from '../components/student-tab';
import { user } from '../helpers/schema';
import {
  parseFile,
  saveUploaded,
  goToPage,
  selectStudent,
  clearUploaded,
} from '../actions/students';
import { showModal } from '../actions/modal';

export default connect(
  (state) => {
    const slice = state.students;
    return {
      uploading: slice.uploading,
      uploaded: slice.uploaded,
      uploadError: slice.uploadError,
      savingUploaded: slice.savingUploaded,
      pageLength: slice.query.$limit,
      students: denormalize(
        slice.items,
        [user],
        state.entities,
      ),
      itemCount: slice.count,
      offset: slice.query.$offset,
      query: slice.query,
    };
  },
  { selectStudent, showModal, goToPage, parseFile, clearUploaded, saveUploaded },
)(StudentTab);
