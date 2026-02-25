import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Protects routes for logged-in users only.
 * Redirects to login page if not authenticated.
 */
const PrivateRoute = () => {
    const { isLoggedIn } = useSelector((state) => state.admin);
    const location = useLocation();

    if (!isLoggedIn) {
        // Redirect to login with redirect back path
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // User is logged in, render child routes
    return <Outlet />;
};

export default PrivateRoute;
