import React from 'react';
import { shape, string, arrayOf } from 'prop-types';
import { Route, Link } from 'react-router-dom';
import bs from '../styles/bootstrap';

export default function ReportTab({ panels }) {
  return (
    <div>
      <Route
        path="/reports"
        exact strict
        render={() => (
          <div className={bs.row}>
            <h2 className={bs.textCenter}>Click to View</h2>
            {panels.map((panel, ix1) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className={bs.colSm3} key={ix1}>
                <div className={[bs.panelDefault].join(' ')}>
                  <div className={bs.panelHeading}>
                    <h3 className={bs.panelTitle}>{panel.name}</h3>
                  </div>
                  <div className={bs.listGroup}>
                    {panel.reports.map((report, ix2) => (
                      <Link
                        // eslint-disable-next-line react/no-array-index-key
                        key={ix2}
                        className={bs.listGroupItem}
                        to={report.href}
                      >
                        {report.name}
                      </Link>
                  ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </div>

  );
}

ReportTab.propTypes = {
  panels: arrayOf(shape({
    name: string.isRequired,
    reports: arrayOf(shape({
      name: string.isRequired,
      href: string.isRequired,
    })).isRequired,
  })).isRequired,
};
