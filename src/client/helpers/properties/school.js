import validate from './validate';

export default [{
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
}];
