export default function format(value) {
  if (value == null) return null;
  switch (value.constructor) {
    case Date:
      return value.toLocaleDateString();
    case Boolean:
      return value ? 'Y' : 'N';
    default:
      return value;
  }
}
