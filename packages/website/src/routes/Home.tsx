import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { State } from '../store/types';

const Home: React.FC = () => {
  const email = useSelector((state: State) =>
    state.userPending ? '' : state.user ? state.user.email : ''
  );

  return <Typography>Hello {email}!</Typography>;
};

export default Home;
