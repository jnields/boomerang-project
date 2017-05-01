import React from 'react';
import { string, arrayOf, node, shape } from 'prop-types';
import TabList from './tab-list';

export default function SchoolHome({ tabs, content, location }) {
  return (
    <TabList tabs={tabs} location={location} content={content} />
  );
}

const tabShape = shape({
  name: string.isRequired,
  path: string.isRequired,
});

SchoolHome.propTypes = {
  tabs: arrayOf(tabShape).isRequired,
  content: node.isRequired,
  location: shape({
    pathname: string.isRequired,
  }).isRequired,
};
