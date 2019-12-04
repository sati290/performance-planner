import { select, put, all, takeLatest, takeEvery } from 'redux-saga/effects';
import * as firebase from 'firebase/app';
import {
  AuthState,
  AuthActionTypes,
  AuthStateChangedAction,
  UserDataActionTypes,
  UserDataUpdateRequestedAction,
  UserDataDisconnectProviderRequestedAction,
} from './types';
import { AppState } from './reducers';
import {
  authLogin,
  authLogout,
  userDataFetchRequested,
  userDataFetchSucceeded,
  userDataFetchFailed,
} from './actions';
import stravaSaga from './strava/sagas';

function* authStateChanged(action: AuthStateChangedAction) {
  const authState: AuthState = yield select((state: AppState) => state.auth);
  const currentUid = authState.pending ? null : authState.uid;

  if (currentUid) {
    yield put(authLogout());
  }

  if (action.payload && action.payload.uid) {
    yield put(authLogin(action.payload));
  } else if (authState.pending) {
    yield put(authLogout());
  }
}

function* watchAuthStateChanged() {
  yield takeLatest(AuthActionTypes.STATE_CHANGED, authStateChanged);
}

function* userDataFetch() {
  yield takeLatest(UserDataActionTypes.FETCH_REQUESTED, function*() {
    try {
      const uid: string = yield select((state: AppState) =>
        state.auth.pending ? null : state.auth.uid
      );
      if (uid) {
        yield import('firebase/firestore');
        const doc: firebase.firestore.DocumentSnapshot = yield firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get();

        const data = doc.data();
        if (data) {
          const { gender, restingHR, maxHR, lthr, linkedProviders } = data;
          yield put(
            userDataFetchSucceeded({
              gender,
              restingHR,
              maxHR,
              lthr,
              linkedProviders,
            })
          );
        } else {
          yield put(userDataFetchSucceeded({ linkedProviders: [] }));
        }
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error(error);
      yield put(userDataFetchFailed());
    }
  });
}

function* userDataUpdate() {
  yield takeEvery(UserDataActionTypes.UPDATE_REQUESTED, function*(
    action: UserDataUpdateRequestedAction
  ) {
    try {
      const uid: string = yield select((state: AppState) =>
        state.auth.pending ? null : state.auth.uid
      );
      if (uid) {
        yield import('firebase/firestore');
        yield firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .set(action.payload, { merge: true });
        yield put(userDataFetchRequested());
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function* userDataDisconnectProvider() {
  yield takeEvery(UserDataActionTypes.DISCONNECT_PROVIDER_REQUESTED, function*(
    action: UserDataDisconnectProviderRequestedAction
  ) {
    try {
      const uid: string = yield select((state: AppState) =>
        state.auth.pending ? null : state.auth.uid
      );
      if (uid) {
        yield import('firebase/firestore');
        yield firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({
            linkedProviders: firebase.firestore.FieldValue.arrayRemove(
              action.payload
            ),
          });
        yield put(userDataFetchRequested());
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error(error);
    }
  });
}

export default function* rootSaga() {
  yield all([
    stravaSaga(),
    watchAuthStateChanged(),
    userDataFetch(),
    userDataUpdate(),
    userDataDisconnectProvider(),
  ]);
}
