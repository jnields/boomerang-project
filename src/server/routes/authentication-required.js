export default function (req, res, next) {
  if (req.user == null) {
    return res.status(401).send({ error: 'unauthenticated' });
  }
  return next();
}
