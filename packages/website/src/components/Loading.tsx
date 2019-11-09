import React from 'react';
import { makeStyles, CircularProgress, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignContent="center"
      className={classes.container}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

export default Loading;
