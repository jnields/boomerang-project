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

  const schoolInclude = {
    model: School,
    where: req.user.school ? { id: req.user.school.id } : undefined,
  };

  const groupInclude = { model: Group };
  const addressInclude = { model: Address };

  const existing = await User.findOne({
    where: { id: req.params.id },
    include: [schoolInclude],
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
      const existingAddress = await existing.getAddress({ transaction });
      if (existingAddress) {
        return existingAddress.update(updates.address, { transaction });
      }
      return existing.createAddress(updates.address, { transaction });
    } else if ('address' in updates) {
      return existing.setAddress(null, { transaction });
    }
    return null;
  }

  await Promise.all([updateGroup(), updateAddress()]);
  await existing.reload({
    transaction,
    include: [groupInclude, addressInclude],
  });
  await transaction.commit();
  return res.send(updated);
}
