import React from 'react';
import { renderToString } from 'react-dom/server';
import { createTransport } from 'nodemailer';
import crypto from 'crypto';
import PasswordResetTemplate from './password-reset-template';
import {
    User,
    AuthMechanism,
} from '../../../models';
import mailConfig from '../../../mail.config';

const transporter = createTransport(mailConfig);

export default async function requestReset(req, res) {
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
    return res.status(204).send();
  }

  await authMech.update(
    {
      userId: user.id,
      resetId: crypto.randomBytes(64).toString('base64'),
      resetAt: new Date(),
    },
    { transaction },
  );
  await transaction.commit();

  try {
    const info = await transporter.sendMail({
      from: mailConfig.auth.user,
      to: user.email,
      subject: 'Boomerang password reset',
      html: renderToString(
        <PasswordResetTemplate
          host={req.headers.host}
          authMechanism={authMech}
        />,
      ),
    });
    console.log(info);
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}
