import { configureStore } from '@reduxjs/toolkit';

import customizationReducer from './features/customization/customizationSlice'; // Import the slice

// import regionReducer from './features/Region/regionSlice';
// import customerReducer from './features/Customers/customerSlice';
import adminReducer from './features/Admin/adminSlice';
import areaReducer from './features/Area/AreaSlice';
import teamReducer from './features/Team/TeamSlice';
import customerReducer from './features/Customers/CustomerSlice';
import connectionReducer from './features/Connection/ConnectionSlice';
import planReducer from './features/Plan/PlanSlice';
import ticketReducer from './features/Tickets/TicketSlice';
import leadReducer from './features/Leads/LeadSlice';
import storeReducer from './features/Stores/StoreSlice';
import couponReducer from './features/Coupons/CouponSlice';
import userReducer from './features/Users/UserSlice';
import productReducer from './features/Products/ProductSlice';
import purchaseReducer from './features/Purchases/PurchaseSlice';
import locationReducer from './features/Locations/LocationSlice';
import staffReducer from './features/Staff/StaffSlice';

import notificationReducer from './features/Notifications/NotificationSlice';

export const store = configureStore({
  reducer: {
    // region: regionReducer,
    customization: customizationReducer, // Add the slice to the reducer object
    // customer: customerReducer,
    area: areaReducer,
    team: teamReducer,
    customer: customerReducer,
    connection: connectionReducer,
    plan: planReducer,
    ticket: ticketReducer,
    notifications: notificationReducer,
    lead: leadReducer,
    //from here
    admin: adminReducer,
    store: storeReducer,
    coupon: couponReducer,
    user: userReducer,
    product: productReducer,
    purchase: purchaseReducer,
    location: locationReducer,
    staff: staffReducer
  }
});
