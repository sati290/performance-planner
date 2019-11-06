import React, { useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import RestrictedRoute from '../components/RestrictedRoute';
import Login from './Login';
import Home from './Home';
import AuthCallback from './StravaAuthCallback';
import Settings from './Settings';

type RoutesProps = {
  user: firebase.User | null;
};

const Routes: React.FC<RoutesProps> = ({ user }) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(location => {
      console.log(location.pathname, location.search);

      gtag('set', { page_path: location.pathname });
      gtag('event', 'page_view');

      return unlisten;
    });
  }, [history]);

  return (
    <Switch>
      <Route path="/login">
        <Login user={user} />
      </Route>
      <RestrictedRoute path="/settings" user={user}>
        <Settings user={user!} />
      </RestrictedRoute>
      <RestrictedRoute path="/stravaAuthCallback" user={user}>
        <AuthCallback />
      </RestrictedRoute>
      <RestrictedRoute exact path="/" user={user}>
        <Home user={user} />
      </RestrictedRoute>
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
