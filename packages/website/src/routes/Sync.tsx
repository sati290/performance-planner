import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, Container } from '@material-ui/core';
import { AppState } from '../store/reducers';
import { syncStravaActivities } from '../store/strava/thunks';

const Sync: React.FC = () => {
  const dispatch = useDispatch();
  const syncState = useSelector((state: AppState) => state.strava.sync);

  return (
    <Container maxWidth="md">
      <Typography>Sync status: {syncState.status}</Typography>
      {(syncState.status === 'syncing' || syncState.status === 'finished') && (
        <Typography>
          Progress {syncState.activitiesProcessed}/{syncState.activitiesTotal}
        </Typography>
      )}
      <Button onClick={() => dispatch(syncStravaActivities())}>
        Start Sync
      </Button>
    </Container>
  );
};

export default Sync;
