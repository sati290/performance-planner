import { Reducer } from 'redux';
import { StravaState, StravaActions, StravaActionTypes } from './types';

const reducer: Reducer<StravaState, StravaActions> = (
  state = {
    accessToken: '',
    expiresAt: 0,
    activities: { status: 'unloaded' },
    sync: { status: 'ready' },
  },
  action
) => {
  switch (action.type) {
    case StravaActionTypes.RECEIVE_API_TOKEN:
      return { ...state, ...action.data };
    case StravaActionTypes.START_LOADING_ACTIVITIES:
      return { ...state, activities: { status: 'loading', data: [] } };
    case StravaActionTypes.RECEIVE_ACTIVITIES:
      if (state.activities.status === 'loading') {
        return {
          ...state,
          activities: {
            status: 'loading',
            data: [...state.activities.data, ...action.data],
          },
        };
      } else {
        return state;
      }
    case StravaActionTypes.FINISH_LOADING_ACTIVITIES:
      if (state.activities.status === 'loading') {
        return {
          ...state,
          activities: { ...state.activities, status: 'loaded' },
        };
      } else {
        return state;
      }
    case StravaActionTypes.UPDATE_SYNC_STATUS:
      return { ...state, sync: action.data };
    default:
      return state;
  }
};

export default reducer;
