import React from 'react';
import { bool } from 'prop-types';
import bs from '../styles/bootstrap.scss';

export default function ModalBackdrop({ shown }) {
  const backdropClasses = [bs.modalBackdrop, bs.fade, bs.in];
  return !shown ? null : (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{ zIndex: '1000000' }}
      className={backdropClasses.join(' ')}
    />
  );
}

ModalBackdrop.propTypes = { shown: bool.isRequired };
