import { School, User } from '../../../models';
import parseQuery from '../parse-query';

const deleteUsers = async (req, res) => {
  const transaction = req.transaction;
  const query = parseQuery(
    req.query,
    {
      transaction,
      where: {
        schoolId: req.user.schoolId,
      },
    },
    User,
  );
  if (query.where == null) res.status(400).send();
  if (query.where.id) {
    if (query.where.id.constructor === Object) {
      query.where.id = {
        ...query.where.id,
        $notIn: [
          ...(query.where.id.$ne ? [query.where.id.$ne] : []),
          ...(query.where.id.$notIn && Array.isArray(query.where.id.$notIn)
            ? query.where.id.$notIn
            : []
          ),
          req.user.id,
        ],
      };
      delete query.where.id.$ne;
    } else {
      query.where.id = {
        $in: Array.isArray(query.where.id)
          ? query.where.id
          : [query.where.id],
        $ne: req.user.id,
      };
    }
  } else {
    query.where.id = { $ne: req.user.id };
  }
  await User.destroy(query);
  await transaction.commit();
  res.status(204).send();
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const transaction = req.transaction;
  const include = [];

  if (`${req.user.id}` === id) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  if (req.user.school) {
    include.push({
      model: School,
      where: { id: req.user.school.id },
    });
  }

  const existing = await User.findOne({
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
    return deleteUser(req, res);
  }
  return deleteUsers(req, res);
}
