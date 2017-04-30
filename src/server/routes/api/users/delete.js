import { School, User } from '../../../models';

export default async function deleteUser(req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  const include = [];

  if (`${req.user.id}` === id) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  if (req.user.school) {
    include.push({
      model: School,
      where: { id: req.user.school.id },
    });
  }

  const existing = await User.findOne({
    where: { id },
    transaction,
    include,
  });

  if (existing) {
    await existing.destroy({ transaction });
    await transaction.commit();
    return res.status(204).send();
  }
  await transaction.rollback();
  return res.status(404).send();
}
