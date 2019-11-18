import React from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import * as firebase from 'firebase/app';
import { AppState } from '../store/reducers';
import RouterButton from '../components/RouterButton';
import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
}));

const TopBar: React.FC = () => {
  const { userLoggedIn, email } = useSelector((state: AppState) =>
    !state.auth.pending && state.auth.uid
      ? { userLoggedIn: true, email: state.auth.email }
      : { userLoggedIn: false, email: '' }
  );
  const classes = useStyles();

  function handleLogout() {
    firebase.auth().signOut();
  }

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          <RouterLink to="/" color="inherit" underline="none">
            Performance Planner
          </RouterLink>
        </Typography>
        {userLoggedIn && (
          <>
            <Typography>{email}</Typography>
            <RouterButton color="inherit" to="/sync">
              Sync
            </RouterButton>
            <RouterButton color="inherit" to="/settings">
              Settings
            </RouterButton>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
