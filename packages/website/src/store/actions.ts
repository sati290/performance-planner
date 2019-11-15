import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import axios from 'axios';
import {
  AthleteData,
  LinkedProviderData,
  StravaAPIToken,
  State,
  RESET_STORE,
  UPDATE_USER,
  RECEIVE_ATHLETE_DATA,
  RECEIVE_LINKED_PROVIDERS,
  RECEIVE_STRAVA_API_TOKEN,
} from './types';

export const resetStore = () => ({ type: RESET_STORE });

export const updateUser = (
  user: firebase.User | null
): ThunkAction<void, State, null, Action> => (dispatch, getState) => {
  const state = getState();
  const currentUid =
    !state.user.pending && state.user.loggedIn && state.user.data.uid;
  const newUid = user && user.uid;
  if (currentUid !== newUid) {
    dispatch(resetStore());
  }

  dispatch({
    type: UPDATE_USER,
    user,
  });
};

export const selectUserId = (state: State) => {
  const { user } = state;
  return (!user.pending && user.loggedIn && user.data.uid) || null;
};

export const receiveAthleteData = (data: AthleteData) => {
  return { type: RECEIVE_ATHLETE_DATA, data };
};

export const fetchAthleteData = (): ThunkAction<void, State, null, Action> => (
  dispatch,
  getState
) => {
  const uid = selectUserId(getState());
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('athleteData')
          .doc(uid)
          .get()
      )
      .then(doc => {
        if (doc.exists) {
          const { gender, restingHR, maxHR, lthr } = doc.data()!;
          dispatch(receiveAthleteData({ gender, restingHR, maxHR, lthr }));
        } else {
          dispatch(
            updateAthleteData({
              gender: '',
              restingHR: 60,
              maxHR: 190,
              lthr: 170,
            })
          );
        }
      })
      .catch(console.error);
  }
};

export const updateAthleteData = (
  data: AthleteData
): ThunkAction<void, State, null, Action> => (dispatch, getState) => {
  const uid = selectUserId(getState());
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('athleteData')
          .doc(uid)
          .set(data)
      )
      .then(() => dispatch(receiveAthleteData(data)))
      .catch(console.error);
  }
};

export const receiveLinkedProviders = (data: LinkedProviderData) => {
  return { type: RECEIVE_LINKED_PROVIDERS, data };
};

export const fetchLinkedProviders = (): ThunkAction<
  void,
  State,
  null,
  Action
> => (dispatch, getState) => {
  const uid = selectUserId(getState());
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .collection('linkedProviders')
          .get()
      )
      .then(result => result.docs.map(doc => doc.id))
      .then(linkedProviders =>
        dispatch(receiveLinkedProviders(linkedProviders))
      )
      .catch(console.error);
  }
};

export const disconnectLinkedProvider = (
  name: string
): ThunkAction<void, State, null, Action> => (dispatch, getState) => {
  const uid = selectUserId(getState());
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .collection('linkedProviders')
          .doc(name)
          .delete()
      )
      .then(() => dispatch(fetchLinkedProviders()))
      .catch(console.error);
  }
};

export const receiveStravaAPIToken = (data: StravaAPIToken) => {
  return { type: RECEIVE_STRAVA_API_TOKEN, data };
};

export const fetchStravaAPIToken = (): ThunkAction<
  Promise<void>,
  State,
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
  State,
  null,
  Action
> => async (dispatch, getState) => {
  const refreshThreshold = Date.now() / 1000 + 600;
  const {
    stravaAPIToken: { accessToken, expiresAt },
  } = getState();
  if (!accessToken || expiresAt < refreshThreshold) {
    await dispatch(fetchStravaAPIToken());
  }

  return getState().stravaAPIToken.accessToken;
};
