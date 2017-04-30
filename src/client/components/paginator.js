import { number, func } from 'prop-types';
import React from 'react';

import bs from '../styles/bootstrap';
import styles from '../styles/helpers';

export default function Paginator(props) {
  const { length, totalPages, currentPage, goToPage } = props;
  const offset = currentPage - (currentPage % length);
  const pages = [];

  for (let i = 1; i < length; i += 1) {
    const thisPage = i + offset;
    let className = '';
    if (currentPage === thisPage) {
      className = bs.active;
    } else if (totalPages < thisPage) {
      className = bs.disabled;
    }
    pages.push(
      <li
        key={i}
        className={className}
      >
        {// eslint-disable-next-line
        }<span
          className={[
            bs.pageLink,
            styles.transBg,
          ].join(' ')}
          onClick={(e) => {
            e.preventDefault();
            if (className) return false;
            goToPage(thisPage);
            return false;
          }}
        >
          {thisPage}
        </span>
      </li>,
    );
  }

  return (
    <nav aria-label="Page navigation">
      <ul className={bs.pagination}>
        <li className={currentPage === 1 ? bs.disabled : ''}>
          {// eslint-disable-next-line
          }<span
            aria-label="Previous"
            className={[
              bs.pageLink,
              styles.transBg,
            ].join(' ')}
            disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage === 1) return false;
              goToPage(currentPage - 1);
              return false;
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </span>
        </li>
        {pages}
        <li className={currentPage + 1 > totalPages ? bs.disabled : ''}>
          {// eslint-disable-next-line
          }<span
            className={[
              bs.pageLink,
              styles.transBg,
            ].join(' ')}
            disabled={currentPage + 1 > totalPages}
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage + 1 > totalPages) return false;
              goToPage(currentPage + 1);
              return false;
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </span>
        </li>
      </ul>
    </nav>
  );
}

Paginator.propTypes = {
  currentPage: number.isRequired,
  goToPage: func.isRequired,
  length: number.isRequired,
  totalPages: number.isRequired,
};
