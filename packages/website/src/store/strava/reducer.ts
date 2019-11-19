import { Reducer } from 'redux';
import { StravaState, StravaActions, StravaActionTypes } from './types';

const reducer: Reducer<StravaState, StravaActions> = (
  state = { accessToken: '', expiresAt: 0 },
  action
) => {
  switch (action.type) {
    case StravaActionTypes.RECEIVE_API_TOKEN:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default reducer;
