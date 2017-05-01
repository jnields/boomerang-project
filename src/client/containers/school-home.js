import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import SchoolHome from '../components/school-home';

export default withRouter(connect(
  state => ({
    tabs: state.tabs.schoolTabs,
    content: state.tabs.schoolRoutes,
  }),
)(SchoolHome));
