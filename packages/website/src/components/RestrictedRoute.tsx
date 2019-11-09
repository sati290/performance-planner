import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { State } from '../store/types';

const RestrictedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const userLoggedIn = useSelector(
    (state: State) => !state.user.pending && state.user.loggedIn
  );

  return (
    <Route {...rest}>{userLoggedIn ? children : <Redirect to="login" />}</Route>
  );
};

export default RestrictedRoute;
