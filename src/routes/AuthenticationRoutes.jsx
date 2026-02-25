import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../component/Loadable';

import MinimalLayout from '../layout/MinimalLayout';

// Lazily Loaded Components
const AuthLogin = Loadable(lazy(() => import('../views/Login')));
const AuthRegister = Loadable(lazy(() => import('../views/Register')));

const AuthenticationRoutes = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      { path: 'login', element: <AuthLogin /> },
      { path: 'register', element: <AuthRegister /> },
      { path: '', element: <Navigate to="login" replace /> } // Redirect root to login
    ]
  }
];

export default AuthenticationRoutes;
