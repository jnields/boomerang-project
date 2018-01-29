import React from 'react';
import { func, bool, string, node } from 'prop-types';
import bs from '../styles/bootstrap.scss';

const handleKeyPress = hideModal => (e) => {
  if (e.key === 'Escape') {
    hideModal();
  }
};

export default function Modal({ hideModal, shown, title, content }) {
  let modal = null;
  if (shown) {
    const modalClasses = [bs.modal, bs.fade, bs.in];
    modal = (
      // eslint-disable-next-line
      <div
        className={modalClasses.join(' ')}
        style={{ display: 'block', zIndex: '1000000', overflow: 'scroll' }}
        onKeyUp={handleKeyPress(hideModal)}
        onClick={hideModal}
      >
        {// eslint-disable-next-line
        }<div
          onClick={e => e.stopPropagation()}
          className={bs.modalDialog}
        >
          <div className={bs.modalContent}>
            <div className={bs.modalHeader}>
              <button type="button" className={bs.close} onClick={hideModal} aria-hidden="true">
                &times;
              </button>
              <h2 className={bs.modalTitle}>{title}</h2>
            </div>
            <div className={bs.modalBody}>
              {content}
            </div>
          </div>
        </div>
      </div>
  );
  }

  return modal;
}

Modal.propTypes = {
  hideModal: func.isRequired,
  shown: bool.isRequired,
  title: string,
  content: node,
};

Modal.defaultProps = {
  title: '',
  content: null,
};
