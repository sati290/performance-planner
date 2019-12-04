import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, Container } from '@material-ui/core';
import { AppState } from '../store/reducers';
import { syncRequested } from '../store/strava/actions';

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
      <Button
        disabled={
          syncState.status !== 'ready' && syncState.status !== 'finished'
        }
        onClick={() => dispatch(syncRequested())}
      >
        Start Sync
      </Button>
    </Container>
  );
};

export default Sync;
