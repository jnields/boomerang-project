import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { user as userShape } from '../helpers/models';
import styles from '../styles/nav-bar';
import bs from '../styles/bootstrap';
import logo from '../assets/logo.png';

export default function NavBar({ logOut, user }) {
  const { firstName, lastName } = (user || {});
  const userInfo = user && (
    <div className={styles.floatRight}>
      <span className={[bs.glyphicon, bs.glyphiconUser, styles.userIcon].join(' ')} />
      <span className={styles.name}>
        {`${firstName || ''} ${lastName || ''}`}
      </span>
      <Link
        className={styles.logOut}
        onClick={() => {
          logOut();
        }}
        to="/login"
      >
      Log Out
    </Link>
    </div>
  );

  return (
    <div className={[styles.default, bs.hiddenPrint].join(' ')}>
      <div>
        <a href="http://boomerangproject.com">
          <img className={styles.logo} src={logo} alt="logo" />
        </a>
        {userInfo}
      </div>
    </div>
  );
}

const {
  func,
} = PropTypes;

NavBar.propTypes = {
  logOut: func.isRequired,
  user: userShape,
};

NavBar.defaultProps = {
  user: null,
};
