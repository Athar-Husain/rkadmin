import React, { useEffect } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminLoginStatus,
  getAdmin,
  AdminLogout
} from '../redux/features/Admin/adminSlice';
import { ToastContainer } from 'react-toastify';
import theme from '../themes';
import Routes from '../routes/index';
import NavigationScroll from './NavigationScroll';

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const { isLoggedIn, Admin } = useSelector((state) => state.admin);

  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('access_token');
      const expiry = localStorage.getItem('token_expiry');
      const isValidToken = token && expiry && Date.now() < parseInt(expiry, 10);

      if (!isValidToken) {
        console.warn('No valid token. Skipping session check.');
        dispatch(AdminLogout());
        return;
      }

      try {
        const status = await dispatch(getAdminLoginStatus()).unwrap();
        console.log('Login status:', status);

        if (status && !Admin) {
          await dispatch(getAdmin()).unwrap();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        dispatch(AdminLogout());
      }
    };

    initSession(); // ✅ Call it inside useEffect
  }, [dispatch]);

  return (
    <NavigationScroll>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme(customization)}>
          <CssBaseline />
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </ThemeProvider>
      </StyledEngineProvider>
    </NavigationScroll>
  );
};

export default App;
