import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { user } from '../helpers/schema';
import { logOut } from '../actions/authorization';
import NavBar from '../components/nav-bar';

export default connect(
  state => ({
    user: denormalize(
      state.authorization.user,
      state.entities,
      user,
      ),
  }),
    { logOut },
)(NavBar);
