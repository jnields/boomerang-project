import {
    User,
    School,
    Address,
    Group,
} from '../../../models';

export default async function postUser(req, res, next) {
  const user = req.body;
  const transaction = req.transaction;
  const include = [
    {
      model: School,
      include: [{ model: Address }],
    },
    { model: Address },
    { model: Group },
  ];

  if (req.body == null || req.body.id != null) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  if (req.user.school) {
    user.schoolId = req.user.school.id;
  }
  switch (req.user.type) {
    case 'ADMIN':
      if (['TEACHER', 'LEADER', 'STUDENT'].indexOf(user.type) !== -1
                && user.school == null
                && user.schoolId == null) {
        await transaction.rollback();
        return res.status(400).send(
                { error: 'incorrect user type provided' },
            );
      }
      break;
    case 'TEACHER':
      if (['STUDENT', 'LEADER'].indexOf(user.type) === -1) {
        await transaction.rollback();
        return res.status(400).send(
          { error: 'incorrect user type provided' },
        );
      }
      break;
    default:
      return next(new RangeError(`unhandled case: ${req.user.type}`));
  }

  const created = User.create(req.body, { transaction });

  async function saveAddress() {
    if (!user.address) return;
    const newAddress = await Address.create(user.address, { transaction });
    delete user.address;
    user.addressId = newAddress.id;
  }

  async function saveGroup() {
    if (!user.group && !user.groupId) return;
    const groupId = user.groupId || user.group.id;
    if (groupId) {
      user.groupId = groupId;
    } else {
      const newGroup = await Group.create(user.group, { transaction });
      user.groupId = newGroup.id;
    }
    delete user.group;
  }

  await Promise.all(saveAddress(), saveGroup());

  const result = await created.reload({ transaction, include });
  await transaction.commit();
  return res.send(result.toJSON());
}
