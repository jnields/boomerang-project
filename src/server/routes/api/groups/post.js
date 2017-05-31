import { School, Group, Address } from '../../../models';
import orm from '../../../helpers/orm';

const postMany = async (req, res) => {
  let groups = req.body;
  const transaction = req.transaction;
  if (req.user.school) {
    groups = groups.map(group => ({
      ...group,
      school: undefined,
      schoolId: req.user.schoolId,
    }));
  } else {
    groups = groups.map((group) => {
      const schoolId = group.schoolId || (group.school || {}).id;
      if (!schoolId) {
        return res.status(400).send({ error: 'bad request' });
      }
      return {
        ...group,
        school: undefined,
        schoolId,
      };
    });
  }
  const created = await Group.bulkCreate(
    groups,
    { transaction },
  );
  const [[{ lastId }]] = await orm.query('SELECT LAST_INSERT_ID() lastId;', { transaction });
  await transaction.commit();
  const results = created.map((group, ix) => ({
    ...group.toJSON(),
    id: lastId + ix,
  }));
  return res.status(201)
    .send(await Promise.all(results));
};

const postOne = async (req, res) => {
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
  const result = created.toJSON();
  delete result.school;
  delete result.schoolId;
  return res.set('Location', `/groups/${result.id}`)
    .status(201)
    .send(result);
};

export default function (req, res) {
  if (Array.isArray(req.body)) {
    return postMany(req, res);
  }
  return postOne(req, res);
}
