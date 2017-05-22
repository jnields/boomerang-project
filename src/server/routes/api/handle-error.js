import {
    UniqueConstraintError,
} from 'sequelize';
import {
  InsecurePasswordError,
  BadQueryError,
  BadRequestError,
  NotFoundError,
} from '../../helpers/errors';

// eslint-disable-next-line no-unused-vars
export default async function (err, req, res, next) {
  try {
    await req.transaction.rollback();
  } catch (e) {
    console.log(e);
  }
  switch (err.constructor) {
    case UniqueConstraintError:
      return res.status(409).send(err.errors ? err.errors : err);
    case NotFoundError:
      return res.status(404).send({ error: err.message || 'not found' });
    case BadQueryError:
    case BadRequestError:
      return res.status(400).send({ error: err.message || 'bad request' });
    case InsecurePasswordError:
      return res.status(422).send({
        error: 'password does not meet length requirements',
      });
    default:
      console.log(err);
      return res.status(500).send({ error: 'server error' });
  }
}
