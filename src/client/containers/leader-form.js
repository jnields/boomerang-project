import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { user } from '../helpers/schema';
import { closeModal } from '../actions/modal';
import { getValues, handleSubmit, deleteLeader } from '../actions/leaders';
import LeaderForm from '../components/leader-form';

const formDecorated = reduxForm(
  {
    form: 'student',
    onSubmit: (values, dispatch) => dispatch(handleSubmit(values)),
  },
)(LeaderForm);

export default connect(
  state => ({
    initialValues: getValues(denormalize(
      state.leaders.selectedLeader,
      user,
      state.entities,
    )),
    deleting: state.leaders.deleting,
    deletable: !!state.leaders.selectedLeader,
  }),
  {
    cancel: closeModal,
    delete: deleteLeader,
  },
)(formDecorated);
