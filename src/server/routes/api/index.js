import { Router } from 'express';
import orm from '../../helpers/orm';
import handleError from './handle-error';
import hasRole from './has-role';
import authenticated from './authentication-required';

import auth from './auth';
import schools from './schools';
import users from './users';
import groups from './groups';

const router = Router();

function startTransaction(req, res, next) {
  orm.transaction({
    autocommit: false,
    isolationLevel: 'READ COMMITTED',
  }).then(
    (transaction) => {
      req.transaction = transaction;
      next();
    },
    (error) => {
      console.log(error);
      res.status(500).send();
    },
  );
}

function json(req, res, next) {
  res.type('json');
  next();
}

router.use(startTransaction, json);
router.use('/auth', auth);
router.use(
  '/schools',
  authenticated,
  hasRole('ADMIN'),
  schools,
);
router.use(
  '/users',
  authenticated,
  hasRole('ADMIN', 'TEACHER'),
  users,
);
router.use(
  '/groups',
  authenticated,
  hasRole('ADMIN', 'TEACHER'),
  groups,
);

router.use(handleError);

export default router;
