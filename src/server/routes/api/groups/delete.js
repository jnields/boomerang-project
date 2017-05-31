import { School, Group } from '../../../models';
import parseQuery from '../parse-query';

const deleteGroups = async (req, res) => {
  const transaction = req.transaction;
  const query = parseQuery(
    req.query,
    {
      transaction,
      where: {
        schoolId: req.user.schoolId,
      },
    },
    Group,
  );
  await Group.destroy(query);
  await transaction.commit();
  res.status(204).send();
};

const deleteGroup = async (req, res) => {
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
};

export default function (req, res) {
  if ('id' in req.params) {
    return deleteGroup(req, res);
  }
  return deleteGroups(req, res);
}
