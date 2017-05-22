import {
    Group,
    School,
    Address,
} from '../../../models';
import parseQuery from '../parse-query';

export default async function (req, res) {
  const transaction = req.transaction;
  const include = [{
    model: School,
    where: req.user.school ? { id: req.user.school.id } : undefined,
    include: [{ model: Address }],
  }];

  const { rows, count } = await Group.findAndCount(
    parseQuery(req.query, { transaction, include }, Group),
  );
  await transaction.commit();
  return res.send({
    count,
    results: rows.map((group) => {
      const result = group.toJSON();
      delete result.school;
      delete result.schoolId;
      return result;
    }),
  });
}
