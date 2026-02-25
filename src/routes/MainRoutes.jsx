import React from 'react';
import Loadable from '../component/Loadable';
import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';
import Notifications from '../views/Notification/Notification';
import AllConnections from '../views/Connections/AllConnections';
import LeadDashboard from '../views/Leads/LeadDashboard';
import BillingDashboard from '../views/Billings/Index';
import LeadManagementPanel from '../views/Leads/LeadManagementPanel';
import AllStores from '../views/Stores/AllStores';
import UpdateStore from '../views/Stores/UpdateStore';
import ViewStore from '../views/Stores/ViewStore';
import CreateStore from '../views/Stores/CreateStore';
import CouponsDashboard from '../views/Coupons/CouponsDashboard';
import CreateCoupon from '../views/Coupons/CreateCoupon';
import AllUsers from '../views/Users/AllUsers';
import AllProducts from '../views/Products/AllProducts';
import AddProduct from '../views/Products/AddProduct';
import PurchaseDashboard from '../views/Purchases/PurchaseDashboard';
import LocationAdminPage from '../views/Locations/Index';
import StaffDashboard from '../views/Staffs/StaffDashboard';
import CreateStaff from '../views/Staffs/CreateStaff';
import CouponList from '../views/Coupons/CouponList';
import CouponsPage from '../views/Coupons/CouponPage';
import SalesDashboard from '../views/Purchases/SalesDashboard';
import LocationManager from '../views/Locations/LocationManager';
// import Staff from '../views/Locations/Index';

const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard/Default')));

// Views - Loadable Imports
const DashboardDefault2 = Loadable(lazy(() => import('../views/Dashboard/Default copy/index')));
const DashboardDefault3 = Loadable(lazy(() => import('../views/Dashboard/Default copy/index6.jsx')));
const Profile = Loadable(lazy(() => import('../views/Profile/ProfileIndex')));
const RegionList = Loadable(lazy(() => import('../views/Regions/RegioList')));
const RegionForm = Loadable(lazy(() => import('../views/Regions/RegionForm')));
const AllTeam = Loadable(lazy(() => import('../views/TeamManagement/All')));
const AddTeam = Loadable(lazy(() => import('../views/TeamManagement/AddTeam')));
const TeamRoles = Loadable(lazy(() => import('../views/TeamManagement/TeamRoles')));
const TeamDetails = Loadable(lazy(() => import('../views/TeamManagement/TeamDetails')));
const AllCustomers = Loadable(lazy(() => import('../views/Customers/All')));
const AddCustomer = Loadable(lazy(() => import('../views/AddCustomer/Index')));

const AllPlans = Loadable(lazy(() => import('../views/Plans/AllPlans')));
const CreatePlan = Loadable(lazy(() => import('../views/Plans/CreatePlan')));
const EditPlan = Loadable(lazy(() => import('../views/Plans/EditPlan')));
const PlanCategory = Loadable(lazy(() => import('../views/Plans/PlanCategory')));

const TicketsList = Loadable(lazy(() => import('../views/TicketBoard/TicketsList')));
const TicketBoard = Loadable(lazy(() => import('../views/TicketBoard/Index')));
const TicketDetails = Loadable(lazy(() => import('../views/TicketDetail/Index')));
const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));

// const ReferScreen = Loadable(lazy(() => import('../views/Referral/ReferScreen')));
// const ReferralTrackingScreen = Loadable(lazy(() => import('../views/Referral/ReferralTrackingScreen')));
// const RewardManagement = Loadable(lazy(() => import('../views/Referral/Rewards')));
// const MakePaymentScreen = Loadable(lazy(() => import('../views/Payment/MakePaymentScreen')));
// const PaymentHistoryScreen = Loadable(lazy(() => import('../views/Payment/PaymentHistoryScreen')));
// const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));
// const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));
// const KanbanBoard2 = Loadable(lazy(() => import('../views/ProjectBoard/Index')));
// const AddCustomer2 = Loadable(lazy(() => import('../views/Customers/Add')));
// const SuspendedCustomer = Loadable(lazy(() => import('../views/Customers/Suspended')));
// const ConnectionForm = Loadable(lazy(() => import('../views/Customers/ConnectionForm')));
// import AllConnections2 from '../views/Connections/AllConnections2';
// const Profile = Loadable(lazy(() => import('../views/Profile/Index')));

// const AllPayments = Loadable(lazy(() => import('../views/Payment/All')));
// const PaymentsOverview = Loadable(lazy(() => import('../views/Payment/PaymentOverview')));
// const Invoices = Loadable(lazy(() => import('../views/Payment/Invoice')));
// const Transactions = Loadable(lazy(() => import('../views/Payment/Transactions')));
// const PendingPayments = Loadable(lazy(() => import('../views/Payment/PendingPayments')));
// const PaymentsHistory = Loadable(lazy(() => import('../views/Payment/PaymentHistory')));
// const Refunds = Loadable(lazy(() => import('../views/Payment/Refunds')));
// const TicketsList = Loadable(lazy(() => import('../views/TicketBoard/TicketsList')));

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
          { path: '/staff', element: <StaffDashboard /> }
        ]
      }
    ]
  }
];

export default MainRoutes;
