import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { Typography, Container } from '@material-ui/core';
import * as firebase from 'firebase/app';
import * as qs from 'querystring';
import axios from 'axios';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const query = qs.parse(location.search.substring(1));

  useEffect(() => {
    const { code, scope, state } = query;
    const from = typeof state === 'string' ? JSON.parse(state).from : '/';

    firebase
      .auth()
      .currentUser!.getIdToken(true)
      .then(token =>
        axios.post(
          (process.env.REACT_APP_API_ORIGIN || '') +
            '/api/providers/strava/link',
          {
            code,
            scope,
          },
          { headers: { Authorization: 'Bearer ' + token } }
        )
      )
      .then(response => {
        console.log(response);
        history.replace(from);
      })
      .catch(console.error);
  }, [query, history]);

  return (
    <Container>
      <Typography>Authorizing...</Typography>
    </Container>
  );
};

export default AuthCallback;
