import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import styles from '../styles/app';
import bs from '../styles/bootstrap';

import NavBar from '../containers/nav-bar';
import LogIn from '../containers/log-in';
import Home from '../containers/home';

function App({ user }) {
  const classes = [
    styles.app,
    bs.container,
  ].join(' ');
  return (<div className={classes}>
    <NavBar />
    <Route exact strict path="/">
      {user == null ? <Redirect to="/login" /> : <Home /> }
    </Route>
    <Route exact strict path="/login" component={LogIn} />
  </div>);
}
App.propTypes = {
  user: PropTypes.number,
};

App.defaultProps = {
  user: null,
};

export default connect(
    state => ({
      user: state.authorization.user,
    }),
    null,
)(App);
