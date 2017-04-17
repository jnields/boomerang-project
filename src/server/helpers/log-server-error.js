import {
    UniqueConstraintError,
} from 'sequelize';
import { InsecurePasswordError } from './errors';

async function handleError(error, req, res) {
  await req.transaction.rollback();
  console.log('constructor:', error.constructor);
  switch (error.constructor) {
    case UniqueConstraintError:
      return res.status(409).send(error.errors ? error.errors : error);
    case InsecurePasswordError:
      return res.status(422).send({
        error: 'password does not meet length requirements',
      });
    default:
      return res.status(500).send({ error: 'server error' });
  }
}

export default function logServerError(error, req, res) {
  handleError(error, req, res).catch(
        () => res.status(500).send({ error: 'server error' }),
    );
}
