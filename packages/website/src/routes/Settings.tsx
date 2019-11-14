import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  TextField,
  Grid,
  MenuItem,
} from '@material-ui/core';
import * as qs from 'querystring';
import stravaConnectImage from '../strava-connect-button.svg';
import { State } from '../store/types';
import {
  fetchLinkedProviders,
  disconnectLinkedProvider,
} from '../store/actions';
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
  pageTile: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  stravaConnectImage: {
    height: '48px',
    width: 'auto',
  },
}));

const Settings: React.FC = () => {
  const classes = useStyles();
  const linkedProvidersState = useSelector(
    (state: State) => state.linkedProviders
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLinkedProviders());
  }, [dispatch]);

  return linkedProvidersState.loaded ? (
    <Container maxWidth="md">
      <Typography variant="h4" className={classes.pageTile}>
        Settings
      </Typography>
      <Typography variant="h6" className={classes.sectionTitle}>
        Athlete data
      </Typography>
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField select label="Gender" fullWidth>
              <MenuItem>Male</MenuItem>
              <MenuItem>Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs>
            <TextField label="Resting HR" fullWidth />
          </Grid>
          <Grid item xs>
            <TextField label="Max HR" fullWidth />
          </Grid>
          <Grid item xs>
            <TextField label="LTHR" fullWidth />
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" className={classes.sectionTitle}>
        Linked providers
      </Typography>
      <Paper className={classes.paper}>
        <List>
          <ListItem>
            <ListItemText>Strava</ListItemText>
            <ListItemSecondaryAction>
              {linkedProvidersState.data.some(p => p === 'strava') ? (
                <Button
                  onClick={() => dispatch(disconnectLinkedProvider('strava'))}
                >
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
