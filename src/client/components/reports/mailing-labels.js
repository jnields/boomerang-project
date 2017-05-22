import React from 'react';
import { arrayOf, string, shape } from 'prop-types';
import MailingLabel from './mailing-label';
import getChunks from './get-chunks';
import bs from '../../styles/bootstrap';

export default function MailingLabels({ items, title }) {
  return (
    <div>
      <h1>{title}</h1>
      {getChunks(items, 3).map((chunk, ix) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={ix} className={bs.row}>
          {chunk.map(student => (
            <div key={student.id} className={bs.colSm4}>
              <MailingLabel user={student} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

MailingLabels.propTypes = {
  items: arrayOf(shape({})).isRequired,
  title: string.isRequired,
};
