import { School } from '../../../models';

export default async function getSchool(req, res) {
  const transaction = req.transaction;
  const id = req.params.id;

  const school = await School.findOne({
    where: { id },
    transaction,
  });
  if (school) {
    await transaction.commit();
    return res.send(school);
  }
  await transaction.rollback();
  return res.status(404).send({ error: 'not found' });
}
