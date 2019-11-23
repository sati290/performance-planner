import {
  RESET_STORE,
  AuthActionTypes,
  UserData,
  UserDataActionTypes,
  StartAuthUpdateAction,
  FinishAuthUpdateAction,
} from './types';

export const resetStore = () => ({ type: RESET_STORE });

export const startAuthUpdate = (
  payload: firebase.User | null
): StartAuthUpdateAction => ({
  type: AuthActionTypes.START_UPDATE,
  payload,
});

export const finishAuthUpdate = (
  payload: firebase.User | null
): FinishAuthUpdateAction => ({ type: AuthActionTypes.FINISH_UPDATE, payload });

export const receiveUserData = (data: UserData) => ({
  type: UserDataActionTypes.RECEIVE,
  data,
});

export const resetUserData = () => ({ type: UserDataActionTypes.RESET });
