import { Router } from 'express';
import logIn from './log-in';
import requestReset from './request-reset';
import resetLogin from './reset-login';
import patchLogin from './patch-login';
import eh from '../catch-decorator';
import hasRole from '../has-role';
import authenticated from '../../authentication-required';

const router = Router();

router.route('/login')
  .post(eh(logIn));

router.route('/login/:id')
  .all(authenticated, hasRole('ADMIN'))
  .patch(eh(patchLogin));

router.route('/reset')
  .post(eh(resetLogin));

router.route('/reset/:username')
  .get(eh(requestReset));

export default router;
