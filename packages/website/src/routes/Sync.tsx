import React from 'react';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { AppState } from '../store/reducers';
import { getStravaAPIToken } from '../store/actions';

const Sync: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action>>();

  const fetchActivityPage = (page: number) =>
    dispatch(getStravaAPIToken()).then(token =>
      axios.get('https://www.strava.com/api/v3/athlete/activities', {
        params: { page, per_page: 200 },
        headers: { Authorization: 'Bearer ' + token },
      })
    );

  const fetchAllActivities = async () => {
    let activities: Array<any> = [];
    let page = 1;

    while (true) {
      console.log('fetching activities, page:', page);
      const response = await fetchActivityPage(page);
      const newActivities = response.data as Array<any>;

      if (newActivities.length === 0) {
        break;
      }

      activities = [...activities, ...newActivities];
      page++;
    }
    console.log('fetched', activities.length, 'activities');

    return activities;
  };

  const handleSync = async () => {
    const activities = await fetchAllActivities();
    console.log('loading streams for activity', activities[0].id);
    const response = await dispatch(getStravaAPIToken()).then(token =>
      axios.get(
        `https://www.strava.com/api/v3/activities/${activities[0].id}/streams`,
        {
          params: { keys: 'heartrate,velocity_smooth', key_by_type: true },
          headers: { Authorization: 'Bearer ' + token },
        }
      )
    );

    console.log(response);
  };

  return (
    <>
      <Button onClick={handleSync}>Start Sync</Button>
    </>
  );
};

export default Sync;
