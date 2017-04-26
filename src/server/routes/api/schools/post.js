import { School } from '../../../models';

export default async function postSchool(req, res) {
  const school = req.body;
  const transaction = req.transaction;
  if (school.id) {
    await transaction.rollback();
    return res.status(422)
      .send({ error: 'explicit value provided for id' });
  }
  const saved = await School.create(school, { transaction });
  if (school.address) {
    await saved.createAddress(school.address, { transaction });
  }
  await transaction.commit();
  return res.set('Location', `/schools/${saved.id}`)
    .status(201)
    .send(saved.toJSON());
}
