import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { user } from '../helpers/schema';
import { user as userShape } from '../helpers/models';

import AdminHome from '../containers/admin-home';
import SchoolHome from '../containers/school-home';

function Home(props) {
  switch ((props.user || {}).type) {
    case 'STUDENT':
    case 'LEADER':
    case 'TEACHER':
      return <SchoolHome />;
    case 'ADMIN':
      return <AdminHome />;
    default:
      return <Redirect to="/login" />;
  }
}

Home.propTypes = { user: userShape };
Home.defaultProps = { user: null };

export default connect(
  state => ({
    user: denormalize(
      state.authorization.user,
      user,
      state.entities,
    ),
  }),
  null,
)(Home);
