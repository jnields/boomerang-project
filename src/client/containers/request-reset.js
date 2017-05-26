import { connect } from 'react-redux';
import RequestReset from '../components/request-reset';
import * as actions from '../actions/authorization';

export default connect(
  state => state.authorization,
  actions,
)(RequestReset);
