import { connect } from 'react-redux';
import Modal from '../components/modal';
import { hideModal } from '../actions/modal';

export default connect(
  state => state.modal,
  { hideModal },
)(Modal);
