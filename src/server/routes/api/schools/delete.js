import { School } from '../../../models';

export default async function deleteSchool(req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  if (id == null) {
    await transaction.rollback();
    return res.status(400).send({ error: 'no id specified to delete' });
  }
  const destroyed = await School.destroy({ where: { id }, limit: 1, transaction });
  if (destroyed) {
    await transaction.commit();
    return res.status(204).end();
  }
  await transaction.rollback();
  return res.status(404).end();
}
