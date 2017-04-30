import React from 'react';
import fa from '../styles/font-awesome';
import styles from '../styles/spinner';

export default function Spinner() {
  const classes = [fa.fa, fa.faSpinner, fa.faSpin, styles.default];
  return <i className={classes.join(' ')} />;
}
