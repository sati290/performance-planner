import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router';

type RestrictedRouteProps = {
  user: firebase.User | null;
} & RouteProps;

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({
  children,
  user,
  ...rest
}) => {
  return <Route {...rest}>{user ? children : <Redirect to="login" />}</Route>;
};

export default RestrictedRoute;
