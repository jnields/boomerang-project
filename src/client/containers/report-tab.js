import { connect } from 'react-redux';
import ReportTab from '../components/report-tab';


export default connect(
  state => state.reports,
)(ReportTab);
