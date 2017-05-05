import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropertyForm from '../components/property-form';

export default connect(
  null,
  null,
)(reduxForm({ form: 'property-form' })(PropertyForm));
