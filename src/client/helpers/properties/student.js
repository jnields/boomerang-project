import user from './user';
import validate from './validate';
import address from './address';
import groupName from './group-name';

export default [
  {
    key: 'group',
    legend: 'Group',
    properties: [groupName],
  },
  {
    key: 'info',
    legend: 'Info',
    properties: [
      ...user,
      {
        header: 'Homeroom',
        name: 'homeRoom',
        test: /(home\s*room)/i,
        type: 'text',
        maxLength: 255,
        validate,
      },
      {
        header: 'Teacher',
        name: 'teacher',
        test: /(teacher)/i,
        type: 'text',
        maxLength: 255,
        validate,
      },
      {
        header: 'Attended Orientation?',
        name: 'oriented',
        test: /(oriented|(attended)?\s*orientation)/i,
        type: 'checkbox',
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
