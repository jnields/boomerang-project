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
  let existing;

  if (req.user.school) {
    existing = await User.findOne({
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
  } else {
    existing = await Address.findOne({
      where: { id: req.params.id },
      transaction,
    });
  }

  if (existing) {
    await existing.destroy({ transaction });
    await transaction.commit();
    return res.status(204).send();
  }
  await transaction.rollback();
  return res.status(404).send();
}
