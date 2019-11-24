import { select, put, all, takeLatest } from 'redux-saga/effects';
import { AuthActionTypes, AuthStateChangedAction, AuthState } from './types';
import { AppState } from './reducers';
import { authLogin, authLogout } from './actions';

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

export default function* rootSaga() {
  yield all([watchAuthStateChanged()]);
}
