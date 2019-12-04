import { ActionCreator } from 'redux';
import {
  StravaAPIToken,
  Activities,
  SyncState,
  StravaActionTypes,
  TokenReceivedAction,
  ActivitiesFetchRequestedAction,
  ActivitiesFetchStartedAction,
  ActivitiesFetchSucceededAction,
  ActivitiesFetchFailedAction,
  ActivitiesReceivedAction,
  SyncRequestedAction,
  SyncStartedAction,
  SyncSucceededAction,
  SyncFailedAction,
  SyncProgressAction,
} from './types';

export const tokenReceived: ActionCreator<TokenReceivedAction> = (
  payload: StravaAPIToken
) => ({
  type: StravaActionTypes.TOKEN_RECEIVED,
  payload,
});

export const activitiesFetchRequested: ActionCreator<
  ActivitiesFetchRequestedAction
> = () => ({ type: StravaActionTypes.ACTIVITIES_FETCH_REQUESTED });

export const activitiesFetchStarted: ActionCreator<
  ActivitiesFetchStartedAction
> = () => ({ type: StravaActionTypes.ACTIVITIES_FETCH_STARTED });

export const activitiesFetchSucceeded: ActionCreator<
  ActivitiesFetchSucceededAction
> = () => ({ type: StravaActionTypes.ACTIVITIES_FETCH_SUCCEEDED });

export const activitiesFetchFailed: ActionCreator<
  ActivitiesFetchFailedAction
> = () => ({ type: StravaActionTypes.ACTIVITIES_FETCH_FAILED });

export const activitiesReceived: ActionCreator<ActivitiesReceivedAction> = (
  payload: Activities
) => ({ type: StravaActionTypes.ACTIVITIES_RECEIVED, payload });

export const syncRequested: ActionCreator<SyncRequestedAction> = () => ({
  type: StravaActionTypes.SYNC_REQUESTED,
});

export const syncStarted: ActionCreator<SyncStartedAction> = () => ({
  type: StravaActionTypes.SYNC_STARTED,
});

export const syncSucceeded: ActionCreator<SyncSucceededAction> = () => ({
  type: StravaActionTypes.SYNC_SUCCEEDED,
});

export const syncFailed: ActionCreator<SyncFailedAction> = () => ({
  type: StravaActionTypes.SYNC_FAILED,
});

export const syncProgress: ActionCreator<SyncProgressAction> = (
  payload: SyncState
) => ({
  type: StravaActionTypes.SYNC_PROGRESS,
  payload,
});
