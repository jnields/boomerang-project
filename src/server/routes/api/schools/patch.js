import {
    School,
    Address,
} from '../../../models';

async function patchInstanceAddress(instance, patch, transaction) {
  const address = await instance.getAddress();
  if (patch) {
    if (address) {
      await address.update(
        patch,
                { transaction },
            );
    } else {
      await instance.createAddress(
        patch,
                { transaction },
            );
    }
  } else if (address) {
    await address.destroy({
      transaction,
    });
  }
  return instance.reload({
    transaction,
    include: [{ model: Address }],
  });
}

export default async function patchSchool(req, res) {
  const patch = req.body;
  const id = req.params.id;
  const transaction = req.transaction;

  if (!patch || (patch.id && `${patch.id}` !== id)) {
    await transaction.rollback();
    return res.status(400).send({ error: 'ID mismatch' });
  }
  delete patch.id;
  const existing = await School.findOne({
    where: { id },
    include: [{ model: Address }],
    transaction,
  });
  if (!existing) {
    await transaction.rollback();
    return res.status(404).send({ error: 'not found' });
  }
  const patchAddress = 'address' in patch;
  const addressPatch = patch.address;
  delete patch.address;

  let updated = await existing.update(
    patch,
          { transaction },
      );
  if (patchAddress) {
    updated = await patchInstanceAddress(
      updated,
      addressPatch,
      transaction,
          );
  }
  await transaction.commit();
  return res.status(200).send(updated.toJSON());
}
