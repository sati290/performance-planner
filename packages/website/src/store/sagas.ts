import { select, put, all, takeLatest } from 'redux-saga/effects';
import { AuthActionTypes, StartAuthUpdateAction } from './types';
import { AppState } from './reducers';
import { resetStore, finishAuthUpdate } from './actions';

function* authUpdate(action: StartAuthUpdateAction) {
  const currentUid = yield select((state: AppState) =>
    state.auth.pending ? null : state.auth.uid
  );
  const newUid = action.payload ? action.payload.uid : null;
  if (currentUid && currentUid !== newUid) yield put(resetStore());

  yield put(finishAuthUpdate(action.payload));
}

function* watchAuthUpdate() {
  yield takeLatest(AuthActionTypes.START_UPDATE, authUpdate);
}

export default function* rootSaga() {
  yield all([watchAuthUpdate()]);
}
