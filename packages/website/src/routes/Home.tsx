import React from 'react';
import { Typography, Button } from '@material-ui/core';

const authorizeParams = {
  client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
  redirect_uri: window.location.origin + '/authCallback',
  response_type: 'code',
  scope: process.env.REACT_APP_STRAVA_SCOPES,
};
const authorizeQueryString = Object.entries(authorizeParams)
  .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
  .join('&');
const authorizeUrl =
  'https://www.strava.com/oauth/authorize?' + authorizeQueryString;

type HomeProps = {
  user: firebase.User | any;
};

export default function Home({ user }: HomeProps) {
  return (
    <>
      <Typography>Hello {user.email}!</Typography>
      <Button href={authorizeUrl}>Authorize with strava</Button>
    </>
  );
}
