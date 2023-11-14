import { Redirect } from 'umi';
import React from 'react';

export default (props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const isLogin = localStorage.getItem('token') !== null;
  if (isLogin) {
    // let roles = JSON.parse(localStorage.getItem('roles')!);
    // roles = typeof roles === 'string' ? [roles] : roles;
    // const isAuthorized = roles.indexOf('ROLE_ADMIN') !== -1;
    // if (isAuthorized) {
      return props.children
    // }
  }
  return <Redirect to="/login" />;
};
