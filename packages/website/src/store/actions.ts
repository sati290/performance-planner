import { RESET_STORE, UserData, UserDataActionTypes } from './types';

export const resetStore = () => ({ type: RESET_STORE });

export const receiveUserData = (data: UserData) => ({
  type: UserDataActionTypes.RECEIVE,
  data,
});

export const resetUserData = () => ({ type: UserDataActionTypes.RESET });
