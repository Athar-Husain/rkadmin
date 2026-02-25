// src/redux/features/Admin/adminService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['User', 'Store', 'Coupon', 'Purchase'],
  endpoints: (builder) => ({
    // Auth
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signin', // Using your email/password signin
        method: 'POST',
        body: credentials
      })
    }),
    // Dashboard Stats
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard'
    }),
    // User Management
    getUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['User']
    }),
    // Store Management
    getStores: builder.query({
      query: () => '/admin/stores',
      providesTags: ['Store']
    }),
    createStore: builder.mutation({
      query: (newStore) => ({
        url: '/admin/stores',
        method: 'POST',
        body: newStore
      }),
      invalidatesTags: ['Store']
    })
  })
});

export const { useAdminLoginMutation, useGetDashboardStatsQuery, useGetUsersQuery, useGetStoresQuery, useCreateStoreMutation } = adminApi;
