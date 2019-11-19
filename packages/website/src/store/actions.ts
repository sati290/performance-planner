import {
  RESET_STORE,
  UserData,
  UserDataActionTypes,
  StravaAPIToken,
  StravaActionTypes,
} from './types';

export const resetStore = () => ({ type: RESET_STORE });

export const receiveUserData = (data: UserData) => ({
  type: UserDataActionTypes.RECEIVE,
  data,
});

export const resetUserData = () => ({ type: UserDataActionTypes.RESET });

export const receiveStravaAPIToken = (data: StravaAPIToken) => {
  return { type: StravaActionTypes.RECEIVE_API_TOKEN, data };
};
