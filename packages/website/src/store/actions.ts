import {
  AuthActionTypes,
  AuthStateChangedAction,
  AuthLoginAction,
  AuthLogoutAction,
  UserData,
  UserDataActionTypes,
  UserDataFetchRequestedAction,
  UserDataFetchSucceededAction,
  UserDataFetchFailedAction,
  UserDataUpdateRequestedAction,
  UserDataDisconnectProviderRequestedAction,
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

export const userDataFetchRequested = (): UserDataFetchRequestedAction => ({
  type: UserDataActionTypes.FETCH_REQUESTED,
});

export const userDataFetchSucceeded = (
  payload: UserData
): UserDataFetchSucceededAction => ({
  type: UserDataActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const userDataFetchFailed = (): UserDataFetchFailedAction => ({
  type: UserDataActionTypes.FETCH_FAILED,
});

export const userDataUpdateRequested = (
  payload: Partial<UserData>
): UserDataUpdateRequestedAction => ({
  type: UserDataActionTypes.UPDATE_REQUESTED,
  payload,
});

export const userDataDisconnectProviderRequested = (
  payload: string
): UserDataDisconnectProviderRequestedAction => ({
  type: UserDataActionTypes.DISCONNECT_PROVIDER_REQUESTED,
  payload,
});
