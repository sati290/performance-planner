import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import axios from 'axios';
import { AppState } from '../reducers';
import {
  receiveStravaAPIToken,
  startLoadingStravaActivities,
  receiveStravaActivities,
  finishLoadingStravaActivities,
} from './actions';

export const fetchStravaAPIToken = (): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action
> => async dispatch => {
  const firebaseToken = await firebase.auth().currentUser!.getIdToken(true);
  const response = await axios.get(
    (process.env.REACT_APP_API_ORIGIN || '') + '/api/providers/strava/token',
    { headers: { Authorization: 'Bearer ' + firebaseToken } }
  );

  dispatch(
    receiveStravaAPIToken({
      accessToken: response.data.access_token,
      expiresAt: response.data.expires_at,
    })
  );
};

export const refreshStravaAPIToken = (): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action
> => async (dispatch, getState) => {
  const refreshThreshold = Date.now() / 1000 + 600;
  const {
    strava: { accessToken, expiresAt },
  } = getState();
  if (!accessToken || expiresAt < refreshThreshold) {
    await dispatch(fetchStravaAPIToken());
  }
};

export const fetchStravaActivities = (): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action
> => async (dispatch, getState) => {
  dispatch(startLoadingStravaActivities());

  let page = 1;

  await dispatch(refreshStravaAPIToken());

  while (true) {
    const response = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        params: { page, per_page: 200 },
        headers: { Authorization: 'Bearer ' + getState().strava.accessToken },
      }
    );
    const newActivities = response.data as Array<any>;

    if (newActivities.length === 0) {
      break;
    }

    dispatch(receiveStravaActivities(newActivities));

    page++;
  }

  dispatch(finishLoadingStravaActivities());
};

export const syncStravaActivities = (): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action
> => async (dispatch, getState) => {
  await dispatch(fetchStravaActivities());

  await dispatch(refreshStravaAPIToken());
  const token = getState().strava.accessToken;

  const {
    strava: { activities },
  } = getState();
  if (activities.status === 'loaded' && activities.data.length > 0) {
    const response = await axios.get(
      `https://www.strava.com/api/v3/activities/${activities.data[0].id}/streams`,
      {
        params: { keys: 'heartrate,velocity_smooth', key_by_type: true },
        headers: { Authorization: 'Bearer ' + token },
      }
    );
    console.log(
      `fetched streams for activity ${activities.data[0].id}:`,
      response.data
    );
  }
};
