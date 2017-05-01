import { SHOW_MODAL, HIDE_MODAL } from './types';

export const showModal =
({ content, title }) =>
({ type: SHOW_MODAL, content, title });

export const hideModal = () => ({ type: HIDE_MODAL });
export const closeModal = hideModal;
