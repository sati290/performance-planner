import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import RestrictedRoute from '../components/RestrictedRoute';
import Login from './Login';
import Home from './Home';

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
      <RestrictedRoute path="/" user={user}>
        <Home user={user} />
      </RestrictedRoute>
    </Switch>
  );
};

export default Routes;
