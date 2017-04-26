import {
    UniqueConstraintError,
} from 'sequelize';
import { InsecurePasswordError, BadQueryError } from '../../helpers/errors';

export default async function (err, req, res, next) {
  try {
    await req.transaction.rollback();
  } catch (e) {
    console.log(e);
  }

  switch (err.constructor) {
    case UniqueConstraintError:
      return res.status(409).send(err.errors ? err.errors : err);
    case BadQueryError:
      return res.status(400).send({ error: err.message });
    case InsecurePasswordError:
      return res.status(422).send({
        error: 'password does not meet length requirements',
      });
    default:
      res.status(500).send({ error: 'server error' });
  }
  return next(err);
}
