import {
  AuthMechanism,
  User,
} from '../../../models';

const emptySalt = Buffer.alloc(16, 0).toString('base64');
const emptyHash = Buffer.alloc(64, 0).toString('base64');

export default async function (req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  const user = await User.findOne({
    where: { id },
    transaction,
  });
  if (user == null) {
    return res.status(404).send({ error: 'not found' });
  }
  const updates = req.body;
  const [authMech] = await AuthMechanism.findOrCreate({
    where: { userId: id },
    defaults: {
      type: 'BASIC',
      salt: emptySalt,
      hash: emptyHash,
      userId: id,
    },
    transaction,
  });
  if (updates.password) {
    authMech.setPassword(updates.password);
  } else if (authMech.salt === emptySalt || authMech.hash === emptyHash) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  authMech.username = updates.username;
  await authMech.save({ transaction });
  await transaction.commit();
  return res.status(204).send();
}
