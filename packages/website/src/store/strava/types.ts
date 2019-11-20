export interface StravaAPIToken {
  accessToken: string;
  expiresAt: number;
}

export type Activities = any[];

export type ActivitiesState =
  | { status: 'unloaded' }
  | { status: 'loading' | 'loaded'; data: Activities };

export type StravaState = StravaAPIToken & { activities: ActivitiesState };

export enum StravaActionTypes {
  RECEIVE_API_TOKEN = 'STRAVA/RECEIVE_API_TOKEN',
  START_LOADING_ACTIVITIES = 'STRAVA/START_LOADING_ACTIVITIES',
  RECEIVE_ACTIVITIES = 'STRAVA/RECEIVE_ACTIVITIES',
  FINISH_LOADING_ACTIVITIES = 'STRAVA/FINISH_LOADING_ACTIVITIES',
}

export interface ReceiveStravaAPITokenAction {
  type: typeof StravaActionTypes.RECEIVE_API_TOKEN;
  data: StravaAPIToken;
}

export interface StartLoadingStravaActivitiesAction {
  type: typeof StravaActionTypes.START_LOADING_ACTIVITIES;
}

export interface ReceiveStravaActivitiesAction {
  type: typeof StravaActionTypes.RECEIVE_ACTIVITIES;
  data: Activities;
}

export interface FinishLoadingStravaActivitiesAction {
  type: typeof StravaActionTypes.FINISH_LOADING_ACTIVITIES;
}

export type StravaActions =
  | ReceiveStravaAPITokenAction
  | StartLoadingStravaActivitiesAction
  | ReceiveStravaActivitiesAction
  | FinishLoadingStravaActivitiesAction;
