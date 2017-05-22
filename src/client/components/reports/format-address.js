export default function formatAddress(address) {
  if (address == null) return null;
  const lines = [];
  if (address.line1) lines.push(address.line1);
  if (address.line2) lines.push(address.line2);
  let cityLine = '';
  if (address.city) cityLine += address.city;
  if (address.state) {
    cityLine += `${cityLine ? ', ' : ''}${address.state}`;
  }
  if (address.zip) {
    cityLine += `${cityLine ? ' ' : ''}${address.zip}`;
  }
  if (cityLine) lines.push(cityLine);
  return lines.join('\n');
}
