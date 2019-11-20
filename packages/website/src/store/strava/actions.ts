import { StravaAPIToken, Activities, StravaActionTypes } from './types';

export const receiveStravaAPIToken = (data: StravaAPIToken) => ({
  type: StravaActionTypes.RECEIVE_API_TOKEN,
  data,
});

export const startLoadingStravaActivities = () => ({
  type: StravaActionTypes.START_LOADING_ACTIVITIES,
});

export const receiveStravaActivities = (data: Activities) => ({
  type: StravaActionTypes.RECEIVE_ACTIVITIES,
  data,
});

export const finishLoadingStravaActivities = () => ({
  type: StravaActionTypes.FINISH_LOADING_ACTIVITIES,
});
