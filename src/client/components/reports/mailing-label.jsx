import React from 'react';
import { shape } from 'prop-types';
import formatAddress from './format-address';
import styles from '../../styles/mailing-label.scss';

export default function MailingLabel({ user }) {
  return (
    <div className={styles.default}>
      {formatAddress(
        user.address,
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      )}
    </div>
  );
}

MailingLabel.propTypes = {
  user: shape({}).isRequired,
};
