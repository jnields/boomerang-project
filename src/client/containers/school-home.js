import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/report-items';
import SchoolHome from '../components/school-home';


export default withRouter(connect(
  state => ({
    tabs: state.tabs.schoolTabs,
    content: state.tabs.schoolRoutes,
    reports: state.reports.panels.reduce(
      (acc, panel) => [...acc, ...panel.reports],
      [],
    ),
    loadingReports: state.reportItems.loading,
  }),
  actions,
)(SchoolHome));
