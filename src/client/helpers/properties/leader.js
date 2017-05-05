import user from './user';
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
    properties: [...user],
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
