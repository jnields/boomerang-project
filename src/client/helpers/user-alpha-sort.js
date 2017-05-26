export default function alpha(a = {}, b = {}) {
  let name1 = (a.lastName || '').toUpperCase();
  let name2 = (b.lastName || '').toUpperCase();
  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  name1 = (a.firstName || '').toUpperCase();
  name2 = (a.firstName || '').toUpperCase();
  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  return 0;
}
