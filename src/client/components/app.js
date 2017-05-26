import React, { Component } from 'react';
import { func } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import styles from '../styles/app';
import bs from '../styles/bootstrap';

import NavBar from '../containers/nav-bar';
import LogIn from '../containers/log-in';
import Home from '../containers/home';
import RequestReset from '../containers/request-reset';
import Reset from '../containers/reset';
import ModalBackdrop from '../containers/modal-backdrop';
import Modal from '../containers/modal';

export default class App extends Component {

  static get propTypes() {
    return { closeModal: func.isRequired };
  }

  componentDidMount() {
    const { closeModal } = this.props;
    document.body.onkeydown = (e) => {
      if (e.keyCode === 27) closeModal();
    };
  }

  render() {
    const classes = [
      styles.app,
      bs.container,
    ].join(' ');

    return (
      <div className={classes}>
        <NavBar />
        <ModalBackdrop />
        <Modal />
        <Switch>
          <Route path="/login" component={LogIn} />
          <Route path="/reset/:resetId" exact component={Reset} />
          <Route path="/reset" exact component={RequestReset} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}
