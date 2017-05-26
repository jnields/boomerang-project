import React from 'react';
import { arrayOf, string } from 'prop-types';
import NameTag from './name-tag';
import getChunks from '../../helpers/get-chunks';
import bs from '../../styles/bootstrap';
import { user as userShape } from '../../helpers/models';

export default function NameTagList({ title, users }) {
  return (
    <div>
      <h1>{title}</h1>
      {getChunks(users, 2).map((chunk, ix) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={ix} className={bs.row}>
          {chunk.map(user => (
            <div key={user.id} className={bs.colSm6}>
              <NameTag user={user} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

NameTagList.propTypes = {
  title: string.isRequired,
  users: arrayOf(userShape).isRequired,
};
