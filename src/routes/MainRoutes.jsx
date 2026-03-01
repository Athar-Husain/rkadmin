import React from 'react';
import Loadable from '../component/Loadable';
import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';
import Notifications from '../views/Notification/Notification';
import AllStores from '../views/Stores/AllStores';
import UpdateStore from '../views/Stores/UpdateStore';
import ViewStore from '../views/Stores/ViewStore';
import CreateStore from '../views/Stores/CreateStore';
import AllUsers from '../views/Users/AllUsers';
import AllProducts from '../views/Products/AllProducts';
import AddProduct from '../views/Products/AddProduct';
import PurchaseDashboard from '../views/Purchases/PurchaseDashboard';
import LocationAdminPage from '../views/Locations/Index';
import StaffDashboard from '../views/Staffs/StaffDashboard';
import CouponsPage from '../views/Coupons/CouponPage';
import SalesDashboard from '../views/Purchases/SalesDashboard';
import LocationManager from '../views/Locations/LocationManager';
import PromotionsDashboard from '../views/Promotions/PromotionsDashboard';
import BannersDashboard from '../views/Banners/BannersDashboard';
import BannerList from '../views/Banners/BannersList';

const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard/Default')));

// Views - Loadable Imports
const Profile = Loadable(lazy(() => import('../views/Profile/ProfileIndex')));
const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));

const MainRoutes = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { path: '/', element: <DashboardDefault /> },
          { path: '/profile', element: <Profile /> },
          { path: '/notifications', element: <Notifications /> },

          { path: '/stores', element: <AllStores /> },
          { path: '/createstore', element: <CreateStore /> },
          { path: '/viewstore/:id', element: <ViewStore /> },
          { path: '/editstore/:id', element: <UpdateStore /> },
          { path: '/coupons', element: <CouponsPage /> },
          { path: '/sales', element: <SalesDashboard /> },

          { path: '/users', element: <AllUsers /> },
          { path: '/products', element: <AllProducts /> },
          { path: '/addproduct', element: <AddProduct /> },
          { path: '/purchases', element: <PurchaseDashboard /> },
          { path: '/locations1', element: <LocationAdminPage /> },
          { path: '/locations', element: <LocationManager /> },
          { path: '/staff', element: <StaffDashboard /> },
          { path: '/promotions', element: <PromotionsDashboard /> },
          { path: '/banners', element: <BannersDashboard /> },
          { path: '/banners2', element: <BannerList /> }
        ]
      }
    ]
  }
];

export default MainRoutes;
