import { Reducer, combineReducers, AnyAction } from 'redux';
import {
  RESET_STORE,
  AuthState,
  AuthActionTypes,
  AuthActions,
  UserDataState,
  UserDataActionTypes,
  UserDataActions,
} from './types';
import stravaReducer from './strava/reducer';

const authReducer: Reducer<AuthState, AuthActions> = (
  state = { pending: true },
  action
) => {
  switch (action.type) {
    case AuthActionTypes.START_UPDATE:
      return state;
    case AuthActionTypes.FINISH_UPDATE: {
      const { payload } = action;
      return payload
        ? { pending: false, uid: payload.uid, email: payload.email || '' }
        : { pending: false, uid: null };
    }
    default:
      return state;
  }
};

const userDataReducer: Reducer<UserDataState, UserDataActions> = (
  state = { loaded: false },
  action
) => {
  switch (action.type) {
    case UserDataActionTypes.RECEIVE:
      return { loaded: true, data: action.data };
    default:
      return state;
  }
};

const appReducer = combineReducers({
  auth: authReducer,
  userData: userDataReducer,
  strava: stravaReducer,
});

export type AppState = ReturnType<typeof appReducer>;

const rootReducer: Reducer<AppState, AnyAction> = (state, action) => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);
  } else {
    return appReducer(state, action);
  }
};

export default rootReducer;
