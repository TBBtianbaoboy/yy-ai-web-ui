import { Redirect } from 'umi';
import React from 'react';

// @Annotation: used to route auth in config/route.ts
// if the user is not login, redirect to login page
interface AuthProps {
  children?: React.ReactNode;
}

const Auth: React.FC<AuthProps> = (props) => {
  const token = localStorage.getItem('token');
  const isLogin = token !== null;
  console.log('auth.tsx: isLogin: ', isLogin);

  if (isLogin) {
    const rolesString = localStorage.getItem('roles');
    const roles = rolesString ? JSON.parse(rolesString) : [];
    const isRoleArray = Array.isArray(roles);
    const isAuthorized = isRoleArray && roles.includes('ROLE_ADMIN');

    if (isAuthorized) {
      return <>{props.children}</>; // Render children when authorized
    }
  }

  // Redirect to the login page if not logged in or not authorized
  return <Redirect to="/login" />;
};

export default Auth;
