export default function (req, res, next) {
  if (req.user == null) {
    return res.status(403).send({ error: 'unauthenticated' });
  }
  return next();
}
