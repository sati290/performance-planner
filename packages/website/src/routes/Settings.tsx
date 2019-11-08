import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import {
  makeStyles,
  CircularProgress,
  Typography,
  Button,
  ButtonBase,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import stravaConnectImage from '../strava-connect-button.svg';

const stravaAuthorizeParams = {
  client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
  redirect_uri: window.location.origin + '/stravaAuthCallback',
  response_type: 'code',
  scope: process.env.REACT_APP_STRAVA_SCOPES,
  state: JSON.stringify({from: '/settings'})
};
const stravaAuthorizeQueryString = Object.entries(stravaAuthorizeParams)
  .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
  .join('&');
const stravaAuthorizeUrl =
  'https://www.strava.com/oauth/authorize?' + stravaAuthorizeQueryString;

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
  },
  stravaConnectImage: {
      height: '48px',
      width: 'auto'
  }
}));

type SettingsProps = {
  user: firebase.User;
};

type SettingsState =
  | { loaded: false }
  | { loaded: true; linkedProviders: Array<string> };

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const classes = useStyles();
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
    loadLinkedProviders();
  }, [user]);

  const disconnectProvider = (providerName: string) => {
    linkedProvidersRef
      .doc(providerName)
      .delete()
      .then(loadLinkedProviders)
      .catch(console.error);
  };

  return state.loaded ? (
    <Container maxWidth="md">
      <Paper className={classes.paper}>
        <Typography variant="h4">Settings</Typography>
        <Typography variant="h6">Linked providers</Typography>
        <List>
          <ListItem>
            <ListItemText>Strava</ListItemText>
            <ListItemSecondaryAction>
              {state.linkedProviders.some(p => p === 'strava') ? (
                <Button onClick={() => disconnectProvider('strava')}>
                  Disconnect
                </Button>
              ) : (
                <ButtonBase href={stravaAuthorizeUrl}><img src={stravaConnectImage} alt="" /></ButtonBase>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Container>
  ) : (
    <CircularProgress />
  );
};

export default Settings;
