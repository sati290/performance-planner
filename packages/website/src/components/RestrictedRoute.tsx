import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { AppState } from '../store/reducers';

const RestrictedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const userLoggedIn = useSelector(
    (state: AppState) => !state.auth.pending && !!state.auth.uid
  );

  return (
    <Route {...rest}>{userLoggedIn ? children : <Redirect to="login" />}</Route>
  );
};

export default RestrictedRoute;
