import { Reducer } from 'redux';
import {
  State,
  RESET_STORE,
  UPDATE_USER,
  RECEIVE_ATHLETE_DATA,
  RECEIVE_LINKED_PROVIDERS,
  RECEIVE_STRAVA_API_TOKEN,
  ActionTypes,
} from './types';

const initialState: State = {
  user: { pending: true },
  athleteData: { loaded: false },
  linkedProviders: { loaded: false },
  stravaAPIToken: { accessToken: '', expiresAt: 0 },
};

const appReducer: Reducer<State, ActionTypes> = (
  state = initialState,
  action
): State => {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...state,
        user: action.user
          ? {
              pending: false,
              loggedIn: true,
              data: { uid: action.user.uid, email: action.user.email || '' },
            }
          : { pending: false, loggedIn: false },
      };
    }
    case RECEIVE_ATHLETE_DATA: {
      return {
        ...state,
        athleteData: { loaded: true, data: action.data },
      };
    }
    case RECEIVE_LINKED_PROVIDERS: {
      return {
        ...state,
        linkedProviders: { loaded: true, data: action.data },
      };
    }
    case RECEIVE_STRAVA_API_TOKEN: {
      return {
        ...state,
        stravaAPIToken: action.data,
      };
    }
    default:
      return state;
  }
};

const rootReducer: Reducer<State, ActionTypes> = (state, action) => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);
  } else {
    return appReducer(state, action);
  }
};

export default rootReducer;
