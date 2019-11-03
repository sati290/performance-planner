import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar>
        <Typography className={classes.title}>PERFORMANCE PLANNER</Typography>
        <Button color="inherit">LOGIN</Button>
      </Toolbar>
    </AppBar>
  );
}
