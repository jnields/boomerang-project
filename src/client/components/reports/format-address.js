import React from 'react';

export default function formatAddress(address, name) {
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
  return (
    <address>
      { name ? [<strong key={0}>{name}</strong>, <br key={1} />] : null }
      {lines.reduce(
        (prev, current, ix) => {
          if (prev.length === 0) {
            return [
              <span key={0}>{current}</span>,
            ];
          }
          return [
            ...prev,
            // eslint-disable-next-line react/no-array-index-key
            <br key={(ix * 2) - 1} />,
            // eslint-disable-next-line react/no-array-index-key
            <span key={ix * 2}>{current}</span>,
          ];
        },
        [],
      )}
    </address>
  );
}
