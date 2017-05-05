import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { handleSearchSubmit as handleSubmit } from '../actions/students';
import SearchForm from '../components/search-form';

export default connect(
  state => ({
    initialValues: { value: state.students.query.string },
  }),
  {},
)(reduxForm({
  form: 'studentQuery',
  onSubmit: (values, dispatch) => dispatch(handleSubmit(values)),
})(SearchForm));
