import React from 'react';
import { Route } from 'react-router-dom';

import styles from '../styles/app';
import bs from '../styles/bootstrap';

import NavBar from '../containers/nav-bar';
import LogIn from '../containers/log-in';
import Home from '../containers/home';
import ModalBackdrop from '../containers/modal-backdrop';
import Modal from '../containers/modal';

export default function App() {
  const classes = [
    styles.app,
    bs.container,
  ].join(' ');
  return (<div className={classes}>
    <NavBar />
    <Route path="/" component={Home} />
    <Route path="/login" component={LogIn} />
    <ModalBackdrop />
    <Modal />
  </div>);
}
