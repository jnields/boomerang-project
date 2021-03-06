import React from 'react';
import { string, arrayOf, node, shape, func } from 'prop-types';
import { Route } from 'react-router-dom';
import bs from '../styles/bootstrap.scss';
import { school as schoolShape } from '../helpers/models';
import TabList from './tab-list';
import Report from '../containers/reports/report';

export default function SchoolHome({
  tabs,
  content,
  location,
  reports,
  leaveReport,
  school,
}) {
  return (
    <div>
      <h2 className={bs.hiddenPrint}>{school.name}</h2>
      <TabList tabs={tabs} location={location} content={content} leaveReport={leaveReport} />
      {reports.map(report => (
        <Route
          key={report.href}
          path={report.href}
          render={() => {
            const Component = report.component;
            return (
              <Report>
                <Component />
              </Report>
            );
          }}
        />
      ))}
    </div>
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
  reports: arrayOf(shape({
    component: func.isRequired,
    href: string.isRequired,
  })).isRequired,
  leaveReport: func.isRequired,
  school: schoolShape.isRequired,
};
