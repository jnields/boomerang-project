import React from 'react';
import { shape as propertyShape } from '../helpers/properties';

export default function Select({ property }) {
  return (
    <select>
      {property.required ? null : <option value="" />}
      {property.options.map(option => (
        <option
          disabled={option.disabled}
          value={option.value}
          key={option.label}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
Select.propTypes = {
  property: propertyShape.isRequired,
};
