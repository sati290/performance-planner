import { Reducer } from 'redux';
import { StravaState, StravaActions, StravaActionTypes } from './types';

const reducer: Reducer<StravaState, StravaActions> = (
  state = {
    token: {
      accessToken: '',
      expiresAt: 0,
    },
    activities: { status: 'unloaded' },
    sync: { status: 'ready' },
  },
  action
) => {
  switch (action.type) {
    case StravaActionTypes.TOKEN_RECEIVED:
      return { ...state, token: action.payload };
    case StravaActionTypes.ACTIVITIES_FETCH_STARTED:
      return { ...state, activities: { status: 'loading', data: [] } };
    case StravaActionTypes.ACTIVITIES_FETCH_SUCCEEDED:
      if (state.activities.status === 'loading') {
        return {
          ...state,
          activities: { ...state.activities, status: 'loaded' },
        };
      } else {
        return state;
      }
    case StravaActionTypes.ACTIVITIES_FETCH_FAILED:
      return { ...state, activities: { status: 'error' } };
    case StravaActionTypes.ACTIVITIES_RECEIVED:
      if (state.activities.status === 'loading') {
        return {
          ...state,
          activities: {
            status: 'loading',
            data: [...state.activities.data, ...action.payload],
          },
        };
      } else {
        return state;
      }
    case StravaActionTypes.SYNC_STARTED:
      return { ...state, sync: { status: 'started' } };
    case StravaActionTypes.SYNC_SUCCEEDED:
      if (state.sync.status === 'syncing') {
        return {
          ...state,
          sync: {
            ...state.sync,
            status: 'finished',
            activitiesProcessed: state.sync.activitiesTotal,
          },
        };
      } else {
        return state;
      }
    case StravaActionTypes.SYNC_FAILED:
      return { ...state, sync: { ...state.sync, status: 'error' } };
    case StravaActionTypes.SYNC_PROGRESS:
      return { ...state, sync: action.payload };
    default:
      return state;
  }
};

export default reducer;
