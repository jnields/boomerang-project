import React from 'react';
import { arrayOf } from 'prop-types';
import Base from '../mailing-labels';
import { user as userShape } from '../../../helpers/models';

export default function MailingLabels({ items }) {
  const title = 'WEB Student Mailing Labels';
  return <Base title={title} items={items} />;
}

MailingLabels.propTypes = {
  items: arrayOf(userShape).isRequired,
};
