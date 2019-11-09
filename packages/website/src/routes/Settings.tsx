import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as firebase from 'firebase/app';
import {
  makeStyles,
  Typography,
  Button,
  ButtonBase,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import * as qs from 'querystring';
import stravaConnectImage from '../strava-connect-button.svg';
import Loading from '../components/Loading';

const stravaAuthorizeUrl =
  'https://www.strava.com/oauth/authorize?' +
  qs.stringify({
    client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
    redirect_uri: window.location.origin + '/stravaAuthCallback',
    response_type: 'code',
    scope: process.env.REACT_APP_STRAVA_SCOPES,
    state: JSON.stringify({ from: '/settings' }),
  });

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
  },
  stravaConnectImage: {
    height: '48px',
    width: 'auto',
  },
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
  const linkedProvidersRef = useMemo(
    () =>
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('linkedProviders'),
    [user.uid]
  );

  const loadLinkedProviders = useCallback(() => {
    console.log('loading linked providers');
    linkedProvidersRef
      .get()
      .then(result => {
        const linkedProviders = result.docs.map(doc => doc.id);
        setState({ loaded: true, linkedProviders });
      })
      .catch(console.error);
  }, [linkedProvidersRef]);

  useEffect(() => loadLinkedProviders(), [user, loadLinkedProviders]);

  const disconnectProvider = (providerName: string) =>
    linkedProvidersRef
      .doc(providerName)
      .delete()
      .then(loadLinkedProviders)
      .catch(console.error);

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
                <ButtonBase href={stravaAuthorizeUrl}>
                  <img src={stravaConnectImage} alt="" />
                </ButtonBase>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Container>
  ) : (
    <Loading />
  );
};

export default Settings;
