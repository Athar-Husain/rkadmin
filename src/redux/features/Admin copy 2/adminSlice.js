import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken')
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.admin = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(user));
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
  }
});

export const { setCredentials, logout } = adminAuthSlice;
export default adminAuthSlice.reducer;
