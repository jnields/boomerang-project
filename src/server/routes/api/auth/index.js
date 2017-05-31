import { Router } from 'express';
import logIn from './log-in';
import requestReset from './request-reset';
import resetLogin from './reset-login';
import patchLogin from './patch-login';
import activate from './activate';
import eh from '../catch-decorator';
import hasRole from '../has-role';
import authenticated from '../../authentication-required';

const router = Router();

router.route('/login')
  .post(eh(logIn));

router.route('/activate')
  .all(authenticated, hasRole('ADMIN'))
  .post(eh(activate));

router.route('/login/:id')
  .all(authenticated, hasRole('ADMIN'))
  .patch(eh(patchLogin));

router.route('/reset')
  .put(eh(resetLogin))
  .post(eh(requestReset));

export default router;
