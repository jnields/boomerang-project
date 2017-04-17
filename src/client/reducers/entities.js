const initialState = {
  users: {},
  schools: {},
};

export default function entities(state = initialState, action) {
  if (action.entities) {
    const result = {};
    Object.keys(state).forEach((key) => {
      result[key] = {
        ...state[key],
        ...action.entities[key],
      };
    });
    return result;
  }
  return state;
}
