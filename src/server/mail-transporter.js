import { createTransport } from 'nodemailer';

const mailConfig = {
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};

export default createTransport(mailConfig);
