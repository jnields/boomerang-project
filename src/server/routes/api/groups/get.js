import { Group, School } from '../../../models';

export default async function (req, res) {
  const transaction = req.transaction;
  const schoolInclude = { model: School };
  const include = [schoolInclude];
  if (req.user.school) {
    schoolInclude.where = {
      id: req.user.school.id,
    };
  }
  const group = await Group.findOne({
    where: {
      id: req.params.id,
    },
    include,
    transaction,
  });
  if (group) {
    await transaction.commit();
    const result = group.toJSON();
    delete result.school;
    delete result.schoolId;
    res.json(group);
  } else {
    await transaction.rollback();
    res.status(404).send({ error: 'not  found' });
  }
}
