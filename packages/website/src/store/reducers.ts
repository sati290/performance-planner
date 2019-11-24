import { Reducer, combineReducers, AnyAction } from 'redux';
import {
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
    case AuthActionTypes.LOGIN:
      return {
        pending: false,
        uid: action.payload.uid,
        email: action.payload.email || '',
      };
    case AuthActionTypes.LOGOUT:
      return { pending: false, uid: null };
    default:
      return state;
  }
};

const userDataReducer: Reducer<UserDataState, UserDataActions> = (
  state = { status: 'unloaded' },
  action
) => {
  switch (action.type) {
    case UserDataActionTypes.FETCH_REQUESTED:
      switch (state.status) {
        case 'unloaded':
        case 'error':
          return { status: 'loading' };
        case 'loaded':
          return { ...state, status: 'reloading' };
        default:
          return state;
      }
    case UserDataActionTypes.FETCH_SUCCEEDED:
      return { status: 'loaded', data: action.payload };
    case UserDataActionTypes.FETCH_FAILED:
      return { status: 'error' };
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
  if (action.type === AuthActionTypes.LOGOUT) {
    return appReducer(undefined, action);
  } else {
    return appReducer(state, action);
  }
};

export default rootReducer;
