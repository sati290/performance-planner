import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Typography } from '@material-ui/core';
import * as firebase from 'firebase/app';
import * as qs from 'querystring';
import axios from 'axios';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const query = qs.parse(location.search);

  useEffect(() => {
    const { code, scope } = query;

    firebase
      .auth()
      .currentUser!.getIdToken(true)
      .then(token => {
        axios
          .post(
            (process.env.REACT_APP_API_ORIGIN || '') +
              '/api/providers/strava/link',
            {
              code,
              scope,
            },
            { headers: { Authorization: 'Bearer ' + token } }
          )
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => console.log('token error:', error));
  });

  //return <Redirect to="/" />;
  return <Typography>Authorizing...</Typography>;
};

export default AuthCallback;
