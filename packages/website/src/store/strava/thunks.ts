import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import axios from 'axios';
import { AppState } from '../reducers';
import { receiveStravaAPIToken } from './actions';

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

export const getStravaAPIToken = (): ThunkAction<
  Promise<string>,
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

  return getState().strava.accessToken;
};
