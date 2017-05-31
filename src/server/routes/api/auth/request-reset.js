import crypto from 'crypto';
import {
    User,
    AuthMechanism,
} from '../../../models';
import transporter from '../../../mail-transporter';

export default async function requestReset(req, res) {
  res.status(202).send();
  const {
    transaction,
    body = {},
  } = req;
  const [user, [authMech]] = await Promise.all([
    User.findOne({
      where: { email: body.username },
      transaction,
    }),
    AuthMechanism.findOrCreate({
      where: { username: body.username },
      defaults: {
        type: 'BASIC',
        username: body.username,
      },
      transaction,
    }),
  ]);

  if (user == null) {
    await transaction.rollback();
  }
  const newId = crypto.randomBytes(64);
  await authMech.update(
    {
      userId: user.id,
      resetId: newId.toString('base64'),
      resetAt: new Date(),
    },
    { transaction },
  );
  await transaction.commit();
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Boomerang Project Password Reset',
      text:
`Somebody recently requested that your password for boomerangproject.com be reset.

To choose a new one, please visit the following link:

${process.env.HOST}/reset/${newId.toString('hex')}

If this was a mistake, simply ignore this e-mail.

Thanks,
Your friends at the Boomerang Project`,
    });
    console.log(info);
  } catch (error) {
    console.log(error);
  }
}
