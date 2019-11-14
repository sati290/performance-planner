import React, { useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import RestrictedRoute from '../components/RestrictedRoute';
import Login from './Login';
import Home from './Home';
import AuthCallback from './StravaAuthCallback';
import Settings from './Settings';
import Sync from './Sync';

const Routes: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(location => {
      gtag('set', { page_path: location.pathname });
      gtag('event', 'page_view');

      return unlisten;
    });
  }, [history]);

  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <RestrictedRoute path="/sync">
        <Sync />
      </RestrictedRoute>
      <RestrictedRoute path="/settings">
        <Settings />
      </RestrictedRoute>
      <RestrictedRoute path="/stravaAuthCallback">
        <AuthCallback />
      </RestrictedRoute>
      <RestrictedRoute exact path="/">
        <Home />
      </RestrictedRoute>
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
