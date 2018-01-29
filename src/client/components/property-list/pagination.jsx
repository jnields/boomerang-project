import React from 'react';
import { number, shape, func } from 'prop-types';
import Paginator from '../paginator';
import bs from '../../styles/bootstrap.scss';

export default function Pagination({ count, params, goToPage }) {
  return (
    <div className={[bs.textCenter].join(' ')}>
      <Paginator
        length={5}
        currentPage={1 + ((params.$offset || 0) / params.$limit)}
        totalPages={Math.ceil(count / params.$limit)}
        goToPage={goToPage}
      />
    </div>
  );
}

Pagination.propTypes = {
  count: number.isRequired,
  params: shape({
    $offset: number,
    $limit: number.isRequired,
  }).isRequired,
  goToPage: func.isRequired,
};
