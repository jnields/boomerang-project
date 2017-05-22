import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/report-items';
import Report from '../../components/reports/report';

export default withRouter(connect(
  state => state.reportItems,
  actions,
)(Report));
