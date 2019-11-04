import React from 'react';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router';

type HomeProps = {
  user: firebase.User | any;
};

export default function Home({ user }: HomeProps) {
  return !user ? (
    <Redirect to="/login" />
  ) : (
    <Typography>Hello {user.email}!</Typography>
  );
}
