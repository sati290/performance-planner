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
import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
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
        <Typography variant="h6" className={classes.title}>
          <RouterLink to="/" color="inherit" underline="none">
            Performance Planner
          </RouterLink>
        </Typography>
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
