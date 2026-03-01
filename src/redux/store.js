import { configureStore } from '@reduxjs/toolkit';

import customizationReducer from './features/customization/customizationSlice'; // Import the slice

// import regionReducer from './features/Region/regionSlice';
// import customerReducer from './features/Customers/customerSlice';
import adminReducer from './features/Admin/adminSlice';
import storeReducer from './features/Stores/StoreSlice';
import couponReducer from './features/Coupons/CouponSlice';
import userReducer from './features/Users/UserSlice';
import productReducer from './features/Products/ProductSlice';
import purchaseReducer from './features/Purchases/PurchaseSlice';
import locationReducer from './features/Locations/LocationSlice';
import staffReducer from './features/Staff/StaffSlice';
import promotionReducer from './features/Promotions/PromotionSlice';
import bannerReducer from './features/Banners/BannerSlice';
import analyticsReducer from './features/Analytics/AnalyticsSlice';

import notificationReducer from './features/Notifications/NotificationSlice';

export const store = configureStore({
  reducer: {
    // region: regionReducer,
    customization: customizationReducer, // Add the slice to the reducer object
    // customer: customerReducer,
    notifications: notificationReducer,
    //from here
    admin: adminReducer,
    store: storeReducer,
    coupon: couponReducer,
    user: userReducer,
    product: productReducer,
    purchase: purchaseReducer,
    location: locationReducer,
    staff: staffReducer,
    promotion: promotionReducer,
    banner: bannerReducer,
    analytics: analyticsReducer
  }
});
