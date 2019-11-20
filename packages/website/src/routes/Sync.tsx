import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { syncStravaActivities } from '../store/strava/thunks';

const Sync: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Button onClick={() => dispatch(syncStravaActivities())}>
        Start Sync
      </Button>
    </>
  );
};

export default Sync;
