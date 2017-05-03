import { User, School, Address, Group } from '../../../models';
import formatUser from '../format-user';
import parseQuery from '../parse-query';

export default async function queryUsers(req, res) {
  const include = [
    { model: Address },
    { model: Group },
    {
      model: School,
      where: req.user.school ? { id: req.user.school.id } : undefined,
    },
  ];
  const transaction = req.transaction;
  const { rows, count } = await User.findAndCount(
    parseQuery(req.query, { transaction, include }, User),
  );
  await transaction.commit();
  return res.send({
    count,
    results: rows.map(formatUser),
  });
}
