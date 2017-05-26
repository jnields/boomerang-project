import {
    School,
    User,
    AuthMechanism,
} from '../../../models';
import assignSession from './assign-session';
import formatUser from '../format-user';

const twentyFourHours = 24 * 60 * 60 * 1000;

export default async function resetLogIn(req, res) {
  const { transaction, body } = req;
  if (!body || !body.resetId || !body.password) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  const { password } = body;
  let resetId;
  try {
    resetId = Buffer.from(body.resetId, 'hex').toString('base64');
  } catch (e) {
    resetId = null;
    return res.status(422).send({ error: 'expired' });
  }
  const authMech = await AuthMechanism.findOne({
    transaction,
    where: {
      resetId,
      resetAt: { $gt: new Date(+new Date() - twentyFourHours) },
    },
    include: [{
      model: User,
      include: [{
        model: School,
      }],
    }],
  });
  if (authMech == null) {
    return res.status(422).send({ error: 'expired' });
  }
  authMech.setPassword(password);
  authMech.sessionId = assignSession(res);
  authMech.resetId = null;
  await authMech.save({ transaction });
  await transaction.commit();
  return res.send(formatUser(authMech.user));
}
