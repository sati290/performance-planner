import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Typography } from '@material-ui/core';
import * as qs from 'querystring';
import axios from 'axios';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const query = qs.parse(location.search);

  useEffect(() => {
    console.log(
      'auth callback effect, code:',
      query.code,
      'scope:',
      query.scope
    );

    axios
      .post(process.env.REACT_APP_API_ORIGIN + '/api/strava/authorize', {
        code: query.code,
        scope: query.scope,
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  });

  //return <Redirect to="/" />;
  return <Typography>Authorizing...</Typography>;
};

export default AuthCallback;
