import React from 'react';
import {
  arrayOf,
} from 'prop-types';

import { user } from '../../helpers/models';
import NameTag from './name-tag';

export default function NameTags({ students }) {
  return (
    <div>
      {students.map(student => <NameTag student={student} />)}
    </div>
  );
}

NameTags.propTypes = {
  students: arrayOf(user).isRequired,
};
