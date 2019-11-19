import { StravaAPIToken, StravaActionTypes } from './types';

export const receiveStravaAPIToken = (data: StravaAPIToken) => {
  return { type: StravaActionTypes.RECEIVE_API_TOKEN, data };
};
