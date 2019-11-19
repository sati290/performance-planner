import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import axios from 'axios';
import { AuthActionTypes, UserData } from './types';
import { AppState } from './reducers';
import { resetStore, receiveUserData, receiveStravaAPIToken } from './actions';

export const updateAuth = (
  user: firebase.User | null
): ThunkAction<void, AppState, null, Action> => (dispatch, getState) => {
  const state = getState();
  const uid = state.auth.pending ? null : state.auth.uid;
  const newUid = user && user.uid;
  if (uid && uid !== newUid) {
    dispatch(resetStore());
  }

  dispatch({
    type: AuthActionTypes.UPDATE_AUTH,
    user,
  });
};

export const fetchUserData = (): ThunkAction<void, AppState, null, Action> => (
  dispatch,
  getState
) => {
  const state = getState();
  const uid = state.auth.pending ? null : state.auth.uid;
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get()
      )
      .then(doc => {
        const data = doc.data();
        if (data) {
          const { gender, restingHR, maxHR, lthr, linkedProviders } = data;
          dispatch(
            receiveUserData({ gender, restingHR, maxHR, lthr, linkedProviders })
          );
        } else {
          dispatch(
            receiveUserData({
              linkedProviders: [],
            })
          );
        }
      })
      .catch(console.error);
  }
};

export const updateUserData = (
  data: Partial<UserData>
): ThunkAction<void, AppState, null, Action> => (dispatch, getState) => {
  const state = getState();
  const uid = state.auth.pending ? null : state.auth.uid;
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .set(data, { merge: true })
      )
      .then(() => dispatch(fetchUserData()))
      .catch(console.error);
  }
};

export const disconnectLinkedProvider = (
  name: string
): ThunkAction<void, AppState, null, Action> => (dispatch, getState) => {
  const state = getState();
  const uid = state.auth.pending ? null : state.auth.uid;
  if (uid) {
    import('firebase/firestore')
      .then(() =>
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({
            linkedProviders: firebase.firestore.FieldValue.arrayRemove(name),
          })
      )
      .then(() => dispatch(fetchUserData()))
      .catch(console.error);
  }
};

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
