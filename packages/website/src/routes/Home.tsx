import React from 'react';
import { Typography } from '@material-ui/core';

type HomeProps = {
  user: firebase.User | any;
};

export default function Home({ user }: HomeProps) {
  return <Typography>Hello {user.email}!</Typography>;
}
