import { School, Group, Address } from '../../../models';

export default async function (req, res) {
  const body = req.body;
  const transaction = req.transaction;
  if (req.user.school) {
    body.schoolId = req.user.school.id;
  } else {
    const schoolId = body.schoolId || (body.school || {}).id;
    if (!schoolId) {
      return res.status(400).send({ error: 'bad request' });
    }
    body.schoolId = schoolId;
  }
  delete body.school;
  const created = await Group.create(
    body,
    {
      transaction,
      include: [{
        model: School,
        include: [{ model: Address }],
      }],
    },
  );
  await transaction.commit();
  return res.set('Location', `/groups/${created.id}`)
    .status(201)
    .send(created.toJSON());
}