import { LOAD_REPORT, LEAVE_REPORT } from './types';
import {
  PENDING,
  COMPLETE,
  ERROR,
  UNSENT,
} from './xhr-statuses';

export const loadReport = query => async (dispatch) => {
  const type = LOAD_REPORT;
  dispatch({ type, status: PENDING });
  try {
    const response = await query();
    if (response.statusCode < 400) {
      return dispatch({
        type,
        status: COMPLETE,
        items: response.body,
      });
    }
    return dispatch({ type, status: ERROR, response });
  } catch (error) {
    return dispatch({ type, status: UNSENT, error });
  }
};

export const leaveReport = () => ({ type: LEAVE_REPORT });
