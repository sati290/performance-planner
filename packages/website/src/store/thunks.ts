import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import { UserData } from './types';
import { AppState } from './reducers';
import { receiveUserData } from './actions';

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
