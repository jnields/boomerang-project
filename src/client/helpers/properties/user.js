import validate from './validate';

// thanks html5 spec writers.
// disable insane no-useless-escape implementation / maxLength
// eslint-disable-next-line
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


export default [
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
    header: 'Middle Name',
    name: 'middleName',
    test: /middle\s*(name|initial)?/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'Phone Number',
    name: 'phone',
    test: /phone\s*(number)?/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'Email',
    name: 'email',
    test: /e\s*-?mail/i,
    type: 'text',
    pattern: emailRegex,
    validate,
    maxLength: 255,
  },
  {
    header: 'First Language',
    name: 'firstLanguage',
    test: /^\s*(first\s*)?language\s*$/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'Language Needs',
    name: 'languageNeeds',
    test: /language\s*needs/i,
    type: 'text',
    validate,
    maxLength: 255,
  },
  {
    header: 'Notes',
    name: 'notes',
    test: /notes/i,
    type: 'textarea',
    validate,
    maxLength: 2550,
  },
  {
    header: 'Gender',
    name: 'gender',
    test: /(gender|sex)/i,
    type: 'select',
    options: [
      {
        label: 'F',
        value: 'F',
      },
      {
        label: 'M',
        value: 'M',
      },
    ],
  },
  {
    header: 'Birthday',
    name: 'dob',
    test: /(birthday|dob)/i,
    type: 'date',
  },
];
