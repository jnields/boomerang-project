import { connect } from 'react-redux';
import Reset from '../components/reset';
import * as actions from '../actions/authorization';

export default connect(
  state => ({
    ...state.authorization,
    title: 'Activate Account',
    successTitle: 'Account Activated',
    errorTitle: 'Link expired: account not activated',
  }),
  actions,
)(Reset);
