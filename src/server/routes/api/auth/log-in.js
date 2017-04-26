import {
    School,
    User,
    AuthMechanism,
} from '../../../models';

import assignSession from './assign-session';
import formatUser from '../format-user';

export default async function logIn(req, res) {
  const { transaction, body } = req;
  if (!body || !body.username || !body.password) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  const { username, password } = body;
  const result = await AuthMechanism.findOne({
    transaction,
    where: { username },
    include: [{
      model: User,
      include: [{
        model: School,
      }],
    }],
  });

  if (result == null || !result.correctPassword(password)) {
    await transaction.rollback();
    return res.status(422).send({ error: 'invalid username / password' });
  }

  const sessionId = assignSession(res, result.sessionId);
  if (result.sessionId !== sessionId) {
    await result.update({ sessionId, transaction });
  }

  await req.transaction.commit();
  return res.send(formatUser(result.user));
}
