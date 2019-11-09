import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';

const Home: React.FC = () => {
  const email = useSelector((state: State) =>
    state.userPending ? '' : state.user ? state.user.email : ''
  );

  return <Typography>Hello {email}!</Typography>;
};

export default Home;
