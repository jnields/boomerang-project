import validate from './validate';
import pattern from './email-pattern';

export default [{
  key: 'info',
  legend: 'Info',
  properties: [
    {
      header: 'First Name',
      name: 'firstName',
      test: /first\s*name/i,
      type: 'text',
      validate,
      maxLength: 255,
      required: true,
    },
    {
      header: 'Last Name',
      name: 'lastName',
      test: /last\s*name/i,
      type: 'text',
      validate,
      maxLength: 255,
      required: true,
    },
    {
      header: 'Email',
      name: 'email',
      test: /e\s*-?\s*mail/,
      type: 'text',
      validate,
      pattern,
      maxLength: 255,
      required: true,
    },
  ],
}];
