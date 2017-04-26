import {
    School,
    User,
    AuthMechanism,
} from '../../../models';
import assignSession from './assign-session';
import formatUser from '../format-user';

export default async function resetLogIn(req, res) {
  const { transaction, body } = req;
  if (!body || !body.sessionId || !body.password) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  const { sessionId, password } = body;
  const authMech = await AuthMechanism.findOne({
    transaction,
    where: { sessionId },
    include: [{
      model: User,
      include: [{
        model: School,
      }],
    }],
  });
  authMech.setPassword(password);
  authMech.sessionId = assignSession(res);
  await authMech.save({ transaction });
  await transaction.commit();
  return res.send(formatUser(authMech.user));
}
