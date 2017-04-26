import {} from '../actions/types';

const initialState = {
  tabs: [
    {
      name: 'Students',
      items: [],
    },
    {
      name: 'Leaders',
      items: [],
    },
    {
      name: 'Groups',
      items: [],
    },
    {
      name: 'Reports',
      items: [],
    },
  ],
};

initialState.selectedTab = initialState.tabs[0];

export default function (state = initialState, action) {
  switch(action.type) {
    case
  }
  return state;
}
