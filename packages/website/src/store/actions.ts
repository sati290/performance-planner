import {
  AuthActionTypes,
  AuthStateChangedAction,
  AuthLoginAction,
  AuthLogoutAction,
  UserData,
  UserDataActionTypes,
} from './types';

export const authStateChanged = (
  payload: firebase.User | null
): AuthStateChangedAction => ({ type: AuthActionTypes.STATE_CHANGED, payload });

export const authLogin = (payload: firebase.User): AuthLoginAction => ({
  type: AuthActionTypes.LOGIN,
  payload,
});

export const authLogout = (): AuthLogoutAction => ({
  type: AuthActionTypes.LOGOUT,
});

export const receiveUserData = (data: UserData) => ({
  type: UserDataActionTypes.RECEIVE,
  data,
});

export const resetUserData = () => ({ type: UserDataActionTypes.RESET });
