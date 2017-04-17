export default function patchRecursive(original = {}, patch) {
  const patched = { ...original };
  Object.keys(patch).forEach((key) => {
    const prop = patch[key];
    if (prop && typeof (prop) === 'object') {
      patched[key] = patchRecursive(original[key] || {}, prop);
    } else {
      patched[key] = prop;
    }
  });
  return patched;
}
