import { Group } from '../../../models';

export default async function (req, res) {
  const patch = req.body;
  const transaction = req.transaction;

  if (patch.schoolId || patch.school || patch.users) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  const existing = await Group.findOne({
    where: { id: req.params.id },
    transaction,
  });
  if (!existing) {
    await transaction.rollback();
    return res.status(404).send({ error: 'not found' });
  }
  const updated = await existing.update(
    patch,
    { transaction },
  );
  await transaction.commit();
  return res.json(updated.toJSON());
}
