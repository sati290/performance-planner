import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';

const RestrictedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const userLoggedIn = useSelector((state: State) =>
    state.userPending ? false : !!state.user
  );

  return (
    <Route {...rest}>{userLoggedIn ? children : <Redirect to="login" />}</Route>
  );
};

export default RestrictedRoute;
