import React from 'react';
import { shape } from 'prop-types';
import formatAddress from './format-address';
import styles from '../../styles/mailing-label';

export default function MailingLabel({ user }) {
  return (
    <div className={styles.default}>
      <div className={styles.name}>
        {`${user.firstName} ${user.lastName}`.trim()}
      </div>
      <div className={styles.address}>
        {formatAddress(user.address)}
      </div>
    </div>
  );
}

MailingLabel.propTypes = {
  user: shape({}).isRequired,
};
