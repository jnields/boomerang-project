export default function alpha(a = {}, b = {}) {
  const name1 = (a.lastName || '').toUpperCase();
  const name2 = (b.lastName || '').toUpperCase();
  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  return 0;
}
