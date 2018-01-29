import React from 'react';
import { bool, string } from 'prop-types';
import fa from '../styles/font-awesome/index.scss';
import styles from '../styles/spinner.scss';

export default function Spinner({ show, hide, className }) {
  const classes = [fa.fa, fa.faSpin, fa.faSpinner];
  if (className) classes.push(className);
  classes.push((!show || hide) ? styles.hidden : styles.shown);
  return <i className={classes.join(' ')} />;
}

Spinner.propTypes = { show: bool, hide: bool, className: string };
Spinner.defaultProps = { hide: false, show: true, className: '' };
