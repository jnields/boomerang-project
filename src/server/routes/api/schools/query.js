import {
    School,
    Address,
} from '../../../models';
import parseQuery from '../parse-query';

export default async function querySchools(req, res) {
  const transaction = req.transaction;
  const include = [{ model: Address }];
  const { rows, count } = await School.findAndCount(
    parseQuery(req.query, { transaction, include }, School),
  );
  await transaction.commit();
  return res.send({
    count,
    results: rows.map(school => school.toJSON()),
  });
}
