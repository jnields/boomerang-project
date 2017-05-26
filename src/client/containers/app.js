import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import App from '../components/app';
import { closeModal } from '../actions/modal';

export default withRouter(connect(null, { closeModal })(App));
