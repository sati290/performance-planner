import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import * as firebase from 'firebase/app';
import RouterButton from '../components/RouterButton';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
}));

type TopBarProps = {
  user: firebase.User | null;
};

export default function TopBar({ user }: TopBarProps) {
  const classes = useStyles();

  function handleLogout() {
    firebase.auth().signOut();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.title}>PERFORMANCE PLANNER</Typography>
        {user && (
          <>
            <Typography>{user.email}</Typography>
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
}
