import { connect } from 'react-redux';
import Reset from '../components/reset';
import * as actions from '../actions/authorization';

export default connect(
  state => ({
    ...state.authorization,
    title: 'Reset Password',
    successTitle: 'Password Successfully Reset',
    errorTitle: 'Password Not Changed',
  }),
  actions,
)(Reset);
