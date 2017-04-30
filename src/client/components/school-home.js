import React from 'react';
import { string, arrayOf, node, shape } from 'prop-types';
import TabList from './tab-list';

export default function SchoolHome({ tabs, activeTab }) {
  return (
    <TabList tabs={tabs.map(tab => tab.name)} activeTab={activeTab.name}>
      {activeTab.content}
    </TabList>
  );
}

const tabShape = shape({
  name: string.isRequired,
  content: node.isRequired,
});

SchoolHome.propTypes = {
  tabs: arrayOf(tabShape).isRequired,
  activeTab: tabShape.isRequired,
};
