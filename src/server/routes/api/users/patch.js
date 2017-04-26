import {
  User, School, Address, Group,
} from '../../../models';

export default async function patchUser(req, res) {
  const updates = req.body;
  const transaction = req.transaction;
  const id = req.params.id;

  if (updates == null || (updates.id && `${updates.id}` !== id)) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  delete updates.type;
  delete updates.school;
  delete updates.schoolId;
  delete updates.addressId;
  delete updates.email;

  const schoolInclude = { model: School };
  const groupInclude = { model: Group };
  const include = [
    { model: Address },
    groupInclude,
    schoolInclude,
  ];


  if (req.user.school) {
    schoolInclude.where = { id: req.user.school.id };
    groupInclude.include = [{
      model: School,
      where: { id: req.user.school.id },
    }];
  }


  const existing = await User.findOne({
    where: { id: req.params.id },
    include,
    transaction,
  });

  if (existing == null) {
    await transaction.rollback();
    return res.status(404).send();
  }

  const updated = await existing.update(updates, { transaction });

  async function updateGroup() {
    if (updates.group || updates.groupId) {
      const groupId = updates.groupId || updates.group.id;
      const group = await Group.findOne(
        {
          where: { id: groupId },
          include: [schoolInclude],
          transaction,
        },
      );
      return updated.setGroup(group, { transaction });
    } else if ('group' in updates || 'groupId' in updates) {
      return updated.setGroup(null, { transaction });
    }
    return null;
  }

  async function updateAddress() {
    if (updates.address) {
      const existingAddress = existing.getAddress();
      if (existingAddress) {
        return existingAddress.update(updates.address, { transaction });
      }
      return existing.createAddress(updates.address, { transaction });
    } else if ('address' in updates) {
      return existing.setAddress(null, { transaction });
    }
    return null;
  }

  await Promise.all(updateGroup(), updateAddress());
  await existing.reload({ transaction, include });
  await transaction.commit();
  return res.send(updated);
}
