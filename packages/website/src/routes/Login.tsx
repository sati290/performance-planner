import React, { useState } from 'react';
import { Redirect } from 'react-router';
import {
  Button,
  Grid,
  TextField,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import * as firebase from 'firebase/app';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8),
  },
}));

type LoginProps = {
  user: firebase.User | any;
};

export default function Login({ user }: LoginProps) {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.analytics().logEvent('login', {});
      })
      .catch(console.log);
  }

  return user ? (
    <Redirect to="/" />
  ) : (
    <Container maxWidth="xs" className={classes.container}>
      <Typography variant="h5">Sign in</Typography>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item xs>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
