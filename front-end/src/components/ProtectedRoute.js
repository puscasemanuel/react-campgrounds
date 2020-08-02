import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

export const ProtectedRoute = (props) => {
  const isAuthenthicated = Cookies.get('session');
  const Component = props.component;

  return isAuthenthicated ? (
    <Component loggedIn={isAuthenthicated} />
  ) : (
    <Redirect to={{ pathname: '/login' }} />
  );
};
