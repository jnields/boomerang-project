import validate from './validate';
import address from './address';

export default [
  {
    key: 'info',
    legend: 'Info',
    properties: [
      {
        header: 'Name',
        name: 'name',
        test: /(name)/i,
        type: 'text',
        maxLength: 255,
        validate,
      },
    ],
  },
  {
    key: 'address',
    legend: 'Address',
    properties: address.map(prop => ({
      ...prop,
      getValue: obj => (obj.address || {})[prop.name],
      setValue: (obj, value) => ({
        ...obj,
        address: !value ? obj.address : {
          ...obj.address,
          [prop.name]: value,
        },
      }),
    })),
  },
];
