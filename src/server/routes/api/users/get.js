import { School, User, Address, Group } from '../../../models';
import formatUser from '../format-user';

export default async function getUser(req, res, next) {
  const transaction = req.transaction;
  const id = req.params.id;
  const schoolInclude = { model: School };
  const include = [
    { model: Address },
    { model: Group },
    schoolInclude,
  ];

  switch (req.user.type) {
    case 'ADMIN':
      break;
    case 'TEACHER':
      schoolInclude.where = {
        id: req.user.school.id,
      };
      break;
    default:
      return next(new RangeError(`unhandled case: ${req.user.type}`));
  }
  const user = await User.findOne({
    where: { id },
    include,
    transaction,
  });

  if (user) {
    await transaction.commit();
    return res.send(formatUser(user));
  }
  await transaction.rollback();
  return res.status(404).send({ error: 'not found' });
}
