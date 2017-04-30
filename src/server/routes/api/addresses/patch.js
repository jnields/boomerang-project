import { Address, User, School } from '../../../models';

export default async function (req, res) {
  const patch = req.body;
  const transaction = req.transaction;

  if (patch.user
        || patch.userId
        || patch.school
        || patch.schoolId) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  let existing = await User.findOne({
    include: [
      {
        model: School,
        where: req.user.school
          ? { id: req.user.school.id }
          : undefined,
      },
      {
        model: Address,
        where: { id: req.params.id },
      },
    ],
    transaction,
  });
  existing = existing || await School.findOne({
    where: req.user.school
      ? { id: req.user.school.id }
      : undefined,
    include: [{
      model: Address,
      where: { id: req.params.id },
    }],
    transaction,
  });
  existing = existing ? existing.address : null;
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
