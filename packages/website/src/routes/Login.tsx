import React, { useState } from 'react';
import { useHistory } from 'react-router';
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

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.replace('/');
      })
      .catch(console.log);
  }

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Typography variant="h5">Sign in</Typography>
      <Grid container direction="column" spacing={2}>
        <Grid item xs></Grid>
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
            type="email"
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
