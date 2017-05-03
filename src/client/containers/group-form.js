import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { group as groupSchema } from '../helpers/schema';
import { closeModal } from '../actions/modal';
import * as actions from '../actions/groups';

import { PENDING, COMPLETE, ERROR } from '../actions/xhr-statuses';
import api from '../helpers/api';
import GroupForm from '../components/group-form';

export default connect(
  state => ({
    initialValues: actions.getValues(denormalize(
      state.groups.selectedGroup,
      groupSchema,
      state.entities,
    )),
    deleting: state.groups.deleting,
    deletable: !!state.groups.selectedGroup,
  }),
  {
    deleteGroup: actions.deleteGroup,
    cancel: closeModal,
  },
)(reduxForm(
  {
    form: 'group',
    asyncValidate: (values, dispatch) => {
      dispatch(actions.validateGroupName(PENDING));
      return api.groups.query({ name: values.name, $limit: 1 }).then(
        ({ body = {} }) => {
          dispatch(actions.validateGroupName(COMPLETE));
          if (body.count && body.results[0].id !== values.id) {
            // eslint-disable-next-line
            throw { name: 'name is in use' };            
          }
        },
        (error) => {
          dispatch(actions.validateGroupName(ERROR));
          throw error;
        },
      );
    },
    onSubmit: (values, dispatch) => dispatch(actions.handleSubmit(values)),
  },
)(GroupForm));
