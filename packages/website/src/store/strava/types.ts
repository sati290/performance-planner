import { Action } from 'redux';

export interface StravaAPIToken {
  accessToken: string;
  expiresAt: number;
}

export type Activities = any[];

export type ActivitiesState =
  | { status: 'unloaded' | 'error' }
  | { status: 'loading' | 'loaded'; data: Activities };

export type SyncState =
  | { status: 'ready' | 'started' | 'fetching_activities' | 'error' }
  | {
      status: 'syncing' | 'finished';
      activitiesTotal: number;
      activitiesProcessed: number;
    };

export type StravaState = {
  token: StravaAPIToken;
  activities: ActivitiesState;
  sync: SyncState;
};

export enum StravaActionTypes {
  TOKEN_RECEIVED = 'STRAVA/TOKEN_RECEIVED',

  ACTIVITIES_FETCH_REQUESTED = 'STRAVA/ACTIVITIES_FETCH_REQUESTED',
  ACTIVITIES_FETCH_STARTED = 'STRAVA/ACTIVITIES_FETCH_STARTED',
  ACTIVITIES_FETCH_SUCCEEDED = 'STRAVA/ACTIVITIES_FETCH_SUCCEEDED',
  ACTIVITIES_FETCH_FAILED = 'STRAVA/ACTIVITIES_FETCH_FAILED',
  ACTIVITIES_RECEIVED = 'STRAVA/ACTIVITIES_RECEIVED',

  SYNC_REQUESTED = 'STRAVA/SYNC_REQUESTED',
  SYNC_STARTED = 'STRAVA/SYNC_STARTED',
  SYNC_SUCCEEDED = 'STRAVA/SYNC_SUCCEEDED',
  SYNC_FAILED = 'STRAVA/SYNC_FAILED',
  SYNC_PROGRESS = 'STRAVA/SYNC_PROGRESS',
}

export interface TokenReceivedAction
  extends Action<StravaActionTypes.TOKEN_RECEIVED> {
  payload: StravaAPIToken;
}

export interface ActivitiesFetchRequestedAction
  extends Action<StravaActionTypes.ACTIVITIES_FETCH_REQUESTED> {}

export interface ActivitiesFetchStartedAction
  extends Action<StravaActionTypes.ACTIVITIES_FETCH_STARTED> {}

export interface ActivitiesFetchSucceededAction
  extends Action<StravaActionTypes.ACTIVITIES_FETCH_SUCCEEDED> {}

export interface ActivitiesFetchFailedAction
  extends Action<StravaActionTypes.ACTIVITIES_FETCH_FAILED> {}

export interface ActivitiesReceivedAction
  extends Action<StravaActionTypes.ACTIVITIES_RECEIVED> {
  payload: Activities;
}

export interface SyncRequestedAction
  extends Action<StravaActionTypes.SYNC_REQUESTED> {}

export interface SyncStartedAction
  extends Action<StravaActionTypes.SYNC_STARTED> {}

export interface SyncSucceededAction
  extends Action<StravaActionTypes.SYNC_SUCCEEDED> {}

export interface SyncFailedAction
  extends Action<StravaActionTypes.SYNC_FAILED> {}

export interface SyncProgressAction
  extends Action<StravaActionTypes.SYNC_PROGRESS> {
  payload: SyncState;
}

export type StravaActions =
  | TokenReceivedAction
  | ActivitiesFetchRequestedAction
  | ActivitiesFetchStartedAction
  | ActivitiesFetchSucceededAction
  | ActivitiesFetchFailedAction
  | ActivitiesReceivedAction
  | SyncRequestedAction
  | SyncStartedAction
  | SyncSucceededAction
  | SyncFailedAction
  | SyncProgressAction;
