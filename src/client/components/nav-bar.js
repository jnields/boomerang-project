import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { user as userShape } from '../helpers/models';
import styles from '../styles/nav-bar';
import bs from '../styles/bootstrap';


export default function NavBar({ logOut, user }) {
  if (user == null) return <div className={styles.default} />;
  const { firstName, lastName } = user;

  return (<div className={styles.default}>
    <div>
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
    </div>);
  </div>);
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
