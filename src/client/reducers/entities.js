const initialState = {
  users: {},
  schools: {},
  addresses: {},
};

export default function entities(state = initialState, action) {
  if (action.entities) {
    return Object.keys(action.entities).reduce(
      (nextState, schema) => ({
        ...nextState,
        [schema]: {
          ...nextState[schema],
          ...action.entities[schema],
        },
      }),
      state,
    );
  }
  return state;
}
