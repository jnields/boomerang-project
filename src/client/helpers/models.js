import {
  shape,
  string,
  oneOf,
  oneOfType,
  bool,
  instanceOf,
} from 'prop-types';

export const address = shape({
  line1: string,
  line2: string,
  line3: string,
  city: string,
  state: string,
  zip: string,
  country: string,
});

export const school = shape({
  name: string,
});

export const group = shape({
  homeroom: string,
  name: string,
  notes: string,

  school,
});

export const user = shape({
  firstName: string,
  lastName: string,
  middleName: string,
  phone: string,
  email: string,
  firstLanguage: string,
  languageNeeds: string,
  notes: string,
  gender: oneOf(['M', 'F']),
  dob: oneOfType([
    instanceOf(Date),
    string,
  ]),

  homeRoom: string,
  teacher: string,
  oriented: bool,

  type: oneOf([
    'STUDENT',
    'LEADER',
    'TEACHER',
    'ADMIN',
  ]).isRequired,

  address,
  school,
  group,
});
