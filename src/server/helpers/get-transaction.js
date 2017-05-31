import orm from './orm';

export default function () {
  return orm.transaction({
    autocommit: false,
    isolationLevel: 'READ COMMITTED',
  });
}
