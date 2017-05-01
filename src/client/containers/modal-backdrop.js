import { connect } from 'react-redux';
import ModalBackdrop from '../components/modal-backdrop';

export default connect(
  state => ({ shown: state.modal.shown }),
)(ModalBackdrop);
