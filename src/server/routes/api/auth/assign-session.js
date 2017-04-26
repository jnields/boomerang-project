import crypto from 'crypto';

export default function (res, sessionId) {
  const newSid = sessionId || crypto.randomBytes(16).toString('base64');
  res.cookie(
    'SID',
    newSid,
    {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    },
  );
  return newSid;
}
