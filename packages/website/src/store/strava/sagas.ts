import { all, takeLatest, put, select } from 'redux-saga/effects';
import * as firebase from 'firebase/app';
import axios, { AxiosResponse } from 'axios';
import { UserDataState } from '../types';
import { AppState } from '../reducers';
import { StravaActionTypes, ActivitiesState } from './types';
import {
  tokenReceived,
  activitiesFetchStarted,
  activitiesFetchSucceeded,
  activitiesFetchFailed,
  activitiesReceived,
  syncProgress,
  syncFailed,
  syncSucceeded,
} from './actions';
import { calculateHRSS } from './processActivity';

function* refreshAccessToken() {
  const refreshThreshold = Date.now() / 1000 + 600;
  const tokenExpiresAt = yield select(
    (state: AppState) => state.strava.token.expiresAt
  );
  if (tokenExpiresAt < refreshThreshold) {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('Unauthorized');
    }

    const firebaseToken: string = yield user.getIdToken(true);
    const response: AxiosResponse = yield axios.get(
      (process.env.REACT_APP_API_ORIGIN || '') + '/api/providers/strava/token',
      { headers: { Authorization: 'Bearer ' + firebaseToken } }
    );

    yield put(
      tokenReceived({
        accessToken: response.data.access_token,
        expiresAt: response.data.expires_at,
      })
    );
  }

  const token: string = yield select(
    (state: AppState) => state.strava.token.accessToken
  );
  return token;
}

function* fetchActivities() {
  try {
    yield put(activitiesFetchStarted());

    const accessToken = yield refreshAccessToken();

    let page = 1;
    while (true) {
      const response = yield axios.get(
        'https://www.strava.com/api/v3/athlete/activities',
        {
          params: { page, per_page: 200 },
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );
      const newActivities: Array<any> = response.data;

      if (newActivities.length === 0) {
        break;
      }

      yield put(activitiesReceived(newActivities));

      page++;
    }

    yield put(activitiesFetchSucceeded());
  } catch (error) {
    console.log(error);
    yield put(activitiesFetchFailed());
  }
}

function* sync() {
  try {
    yield put(syncProgress({ status: 'fetching_activities' }));
    yield fetchActivities();

    const [activities, userData]: [
      ActivitiesState,
      UserDataState
    ] = yield select((state: AppState) => [
      state.strava.activities,
      state.userData,
    ]);
    if (activities.status === 'loaded' && userData.status === 'loaded') {
      yield put(
        syncProgress({
          status: 'syncing',
          activitiesTotal: activities.data.length,
          activitiesProcessed: 0,
        })
      );

      let processed = 0;
      for (const activity of activities.data.slice().reverse()) {
        const accessToken: string = yield refreshAccessToken();
        try {
          const response: AxiosResponse<any> = yield axios.get(
            `https://www.strava.com/api/v3/activities/${activity.id}/streams`,
            {
              params: {
                keys: 'time,heartrate,velocity_smooth',
                key_by_type: true,
              },
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
            }
          );

          if (
            'time' in response.data &&
            'heartrate' in response.data &&
            'velocity_smooth' in response.data
          ) {
            const hrss = calculateHRSS(response.data, userData.data as any);

            console.log(
              `activity ${activity.id} at ${activity.start_date} moving time: ${activity.moving_time} hrss: ${hrss}`
            );
          } else {
            console.warn('missing streams for activity', activity.id);
          }
        } catch (error) {
          if (error.response.status === 404) {
            console.warn('failed to fetch streams for activity', activity.id);
          } else {
            throw error;
          }
        }

        yield put(
          syncProgress({
            status: 'syncing',
            activitiesTotal: activities.data.length,
            activitiesProcessed: processed++,
          })
        );
      }

      yield put(syncSucceeded());
    }
  } catch (error) {
    console.log(error);
    yield put(syncFailed());
  }
}

function* watchActivitiesFetchRequested() {
  yield takeLatest(
    StravaActionTypes.ACTIVITIES_FETCH_REQUESTED,
    fetchActivities
  );
}

function* watchSyncRequested() {
  yield takeLatest(StravaActionTypes.SYNC_REQUESTED, sync);
}

export default function* rootSaga() {
  yield all([watchActivitiesFetchRequested(), watchSyncRequested()]);
}
