import { School, Group } from '../../../models';

export default async function (req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  const include = [];

  if (req.user.school) {
    include.push({
      model: School,
      where: { id: req.user.school.id },
    });
  }

  const existing = await Group.findOne({
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
