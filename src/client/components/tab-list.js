import React from 'react';
import { arrayOf, string, node, shape } from 'prop-types';
import { Link, matchPath, Redirect } from 'react-router-dom';


import bs from '../styles/bootstrap';

export default function TabList(props) {
  const { location: { pathname: path }, tabs, content } = props;
  let anyMatch = false;
  const tabItems = tabs.map((tab) => {
    const isMatch = matchPath(path, { path: tab.path, exact: tab.path === '/' }) !== null;
    if (isMatch) anyMatch = true;
    return (
      <li
        className={isMatch ? bs.active : ''}
        key={tab.name}
      >
        <Link replace to={tab.path}>
          {tab.name}
        </Link>
      </li>
    );
  });
  if (!anyMatch) return <Redirect to="/" />;
  return (
    <div>
      <ul className={[bs.nav, bs.navTabs, bs.hiddenPrint].join(' ')}>
        {tabItems}
      </ul>
      {content}
    </div>
  );
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
