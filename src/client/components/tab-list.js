import React from 'react';
import { arrayOf, string, node, shape } from 'prop-types';
import { Link, matchPath } from 'react-router-dom';

import bs from '../styles/bootstrap';

export default function TabList(props) {
  const { location: { pathname: path }, tabs, content } = props;
  return (<div>
    <ul className={[bs.nav, bs.navTabs].join(' ')}>
      {tabs.map(tab => (
        <li
          className={matchPath(tab.path, { path, exact: true }) ? bs.active : ''}
          key={tab.name}
        >
          <Link to={tab.path}>
            {tab.name}
          </Link>
        </li>
        ))}
    </ul>
    {content}
  </div>);
}

TabList.propTypes = {
  content: node.isRequired,
  tabs: arrayOf(shape({
    name: string.isRequired,
    path: string.isRequired,
  })).isRequired,
  location: shape({
    pathname: string.isRequired,
  }).isRequired,
};
