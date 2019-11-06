import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import {
  CircularProgress,
  Typography,
  Button,
  CssBaseline,
} from '@material-ui/core';

const stravaAuthorizeParams = {
  client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
  redirect_uri: window.location.origin + '/stravaAuthCallback',
  response_type: 'code',
  scope: process.env.REACT_APP_STRAVA_SCOPES,
};
const stravaAuthorizeQueryString = Object.entries(stravaAuthorizeParams)
  .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
  .join('&');
const stravaAuthorizeUrl =
  'https://www.strava.com/oauth/authorize?' + stravaAuthorizeQueryString;

type SettingsProps = {
  user: firebase.User;
};

type SettingsState =
  | { loaded: false }
  | { loaded: true; linkedProviders: Array<string> };

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [state, setState] = useState<SettingsState>({ loaded: false });
  const linkedProvidersRef = firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .collection('linkedProviders');

  const loadLinkedProviders = () => {
    console.log('loading linked providers');
    linkedProvidersRef
      .get()
      .then(result => {
        const linkedProviders = result.docs.map(doc => doc.id);
        setState({ loaded: true, linkedProviders });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!state.loaded) {
      loadLinkedProviders();
    }
  });

  const disconnectProvider = (providerName: string) => {
    linkedProvidersRef
      .doc(providerName)
      .delete()
      .then(loadLinkedProviders)
      .catch(console.error);
  };

  return (
    <>
      <CssBaseline />
      {state.loaded ? (
        <>
          <Typography>Strava</Typography>
          {state.linkedProviders.some(p => p === 'strava') ? (
            <Button onClick={() => disconnectProvider('strava')}>
              Disconnect
            </Button>
          ) : (
            <Button href={stravaAuthorizeUrl}>Connect</Button>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Settings;