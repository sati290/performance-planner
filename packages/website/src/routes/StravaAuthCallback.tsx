import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import * as qs from 'querystring';
import axios from 'axios';
import { userDataFetchRequested } from '../store/actions';
import { receiveStravaAPIToken } from '../store/strava/actions';
import Loading from '../components/Loading';

const AuthCallback: React.FC = () => {
  const dispatch = useDispatch();
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
        dispatch(
          receiveStravaAPIToken({
            accessToken: response.data.access_token,
            expiresAt: response.data.expires_at,
          })
        );
        dispatch(userDataFetchRequested());
        history.replace(from);
      })
      .catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Loading />;
};

export default AuthCallback;
