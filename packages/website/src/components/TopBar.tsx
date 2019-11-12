import React from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import { State } from '../store/types';
import * as firebase from 'firebase/app';
import RouterButton from '../components/RouterButton';
import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
}));

const TopBar: React.FC = () => {
  const user = useSelector((state: State) =>
    !state.user.pending && state.user.loggedIn ? state.user.data : null
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
        {user && (
          <>
            <Typography>{user.email}</Typography>
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
