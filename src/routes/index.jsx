import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

export default function ThemeRoutes() {
  const { isLoggedIn } = useSelector((state) => state.admin);

  const routes = isLoggedIn ? [...MainRoutes] : [...AuthenticationRoutes];

  // Add fallback route
  routes.push({
    path: '*',
    element: <Navigate to={isLoggedIn ? '/' : '/login'} replace />
  });

  return useRoutes(routes);
}
