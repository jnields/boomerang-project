import React, { Component } from 'react';
import { arrayOf, shape, string, func, number } from 'prop-types';
import bs from '../styles/bootstrap';
import Spinner from './spinner';

export default class ReportTab extends Component {

  static get propTypes() {
    return {
      panels: arrayOf(shape({
        name: string.isRequired,
        reports: arrayOf(shape({
          key: number.isRequired,
          name: string.isRequired,
          download: func.isRequired,
        })).isRequired,
      })).isRequired,
    };
  }
  constructor(props) {
    super(props);
    const state = { errors: {} };
    props.panels.forEach(panel => panel.reports.forEach((report) => {
      state[report.key] = false;
      state.errors[report.key] = false;
    }));
    this.state = state;
  }
  render() {
    return (
      <div className={bs.row}>
        <h2 className={bs.textCenter}>Click to Download</h2>
        {this.props.panels.map(panel => (
          <div className={bs.colSm3} key={panel.name}>
            <div className={[bs.panel, bs.panelDefault].join(' ')}>
              <div className={bs.panelHeading}>
                <h3 className={bs.panelTitle}>{panel.name}</h3>
              </div>
              <div className={bs.listGroup}>
                {panel.reports.map(report => (
                  <button
                    key={report.key}
                    type="button"
                    className={bs.listGroupItem}
                    onClick={() => {
                      this.setState({
                        [report.key]: true,
                        errors: {
                          ...this.state.errors,
                          [report.key]: false,
                        },
                      });
                      Promise.resolve(report.download()).then(
                        () => this.setState({ [report.key]: false }),
                        () => this.setState({
                          [report.key]: false,
                          errors: {
                            ...this.state.errors,
                            [report.key]: true,
                          },
                        }),
                        );
                    }}
                    disabled={this.state[report.key] === true}
                  >
                    {this.state[report.key] === true ? <Spinner /> : null}
                    {this.state.errors[report.key] === false
                          ? null
                          : <span
                            className={[
                              bs.glyphicon,
                              bs.glyphiconError,
                            ].join(' ')}
                          />
                        }
                    {report.name}
                  </button>
                    ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
