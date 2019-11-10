import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { State } from '../store/types';
import { getStravaAPIToken } from '../store/actions';

const Home: React.FC = () => {
  const email = useSelector(
    (state: State) =>
      (!state.user.pending && state.user.loggedIn && state.user.data.email) ||
      ''
  );

  const dispatch = useDispatch();
  const stravaToken = useSelector((state: State) => state.stravaAPIToken);

  return (
    <>
      <Typography>Hello {email}!</Typography>
      <Typography>
        Your strava token is: {stravaToken.accessToken}, and it expires at:{' '}
        {stravaToken.expiresAt}
      </Typography>
      <Button onClick={() => dispatch(getStravaAPIToken())}>
        Refresh token
      </Button>
    </>
  );
};

export default Home;
