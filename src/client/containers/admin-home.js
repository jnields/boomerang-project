import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TabList from '../components/tab-list';

export default withRouter(connect(
  state => ({
    tabs: state.tabs.tabs,
    content: state.tabs.routes,
  }),
)(TabList));
