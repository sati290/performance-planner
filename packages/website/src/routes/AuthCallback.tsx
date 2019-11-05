import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Typography } from '@material-ui/core';
import * as qs from 'querystring';

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
  });

  //return <Redirect to="/" />;
  return <Typography>Authorizing...</Typography>;
};

export default AuthCallback;
