export default function hasRole(...args) {
  return (req, res, next) => {
    if ([].indexOf.call(args, req.user.type) === -1) {
      return res.status(403).send({ error: 'unauthorized' });
    }
    return next();
  };
}
