import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import axios from 'axios';
import { UserData } from '../types';
import { AppState } from '../reducers';
import {
  receiveStravaAPIToken,
  startLoadingStravaActivities,
  receiveStravaActivities,
  finishLoadingStravaActivities,
  updateStravaSyncStatus,
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

interface ActivityStream<T> {
  original_size: number;
  resolution: 'low' | 'medium' | 'high';
  series_type: 'distance' | 'time';
  data: T[];
}

interface ActivityStreams {
  time: ActivityStream<number>;
  heartrate: ActivityStream<number>;
  velocity_smooth: ActivityStream<number>;
}

const calculateHRSS = (
  {
    time: { data: times },
    heartrate: { data: heartrates },
    velocity_smooth: { data: velocities },
  }: ActivityStreams,
  {
    gender,
    restingHR,
    maxHR,
    lthr,
  }: Required<Pick<UserData, 'gender' | 'restingHR' | 'maxHR' | 'lthr'>>
) => {
  const movingThresholdKph = 0.1;
  const trimpGenderFactor = gender === 'male' ? 1.92 : 1.67;

  let trainingImpulse = 0;
  for (let i = 0; i < heartrates.length; i++) {
    if (i > 0 && velocities[i] * 3.6 > movingThresholdKph) {
      const durationSeconds = times[i] - times[i - 1];
      const durationMinutes = durationSeconds / 60;

      const hr = (heartrates[i] + heartrates[i - 1]) / 2;
      const heartRateReserve = (hr - restingHR) / (maxHR - restingHR);

      trainingImpulse +=
        durationMinutes *
        heartRateReserve *
        0.64 *
        Math.exp(trimpGenderFactor * heartRateReserve);
    }
  }

  const lactateThresholdReserve = (lthr - restingHR) / (maxHR - restingHR);
  const lactateThresholdTrainingImpulse =
    60 *
    lactateThresholdReserve *
    0.64 *
    Math.exp(trimpGenderFactor * lactateThresholdReserve);
  const hrss = (trainingImpulse / lactateThresholdTrainingImpulse) * 100;

  return hrss;
};

export const syncStravaActivities = (): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action
> => async (dispatch, getState) => {
  dispatch(updateStravaSyncStatus({ status: 'fetching_activities' }));
  await dispatch(fetchStravaActivities());

  const {
    strava: { activities },
    userData,
  } = getState();
  if (activities.status === 'loaded' && userData.loaded) {
    dispatch(
      updateStravaSyncStatus({
        status: 'syncing',
        activitiesTotal: activities.data.length,
        activitiesProcessed: 0,
      })
    );

    let processed = 0;
    for (const activity of activities.data.slice().reverse()) {
      await dispatch(refreshStravaAPIToken());
      try {
        const response = await axios.get(
          `https://www.strava.com/api/v3/activities/${activity.id}/streams`,
          {
            params: {
              keys: 'time,heartrate,velocity_smooth',
              key_by_type: true,
            },
            headers: {
              Authorization: 'Bearer ' + getState().strava.accessToken,
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
            `activity ${activity.id} at ${activity.start_date} duration: ${activity.duration} hrss: ${hrss}`
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

      dispatch(
        updateStravaSyncStatus({
          status: 'syncing',
          activitiesTotal: activities.data.length,
          activitiesProcessed: processed++,
        })
      );
    }

    dispatch(
      updateStravaSyncStatus({
        status: 'finished',
        activitiesTotal: activities.data.length,
        activitiesProcessed: processed,
      })
    );
  }
};
