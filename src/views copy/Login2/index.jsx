import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAdminLoginMutation } from '../../redux/features/Admin/adminService';
import { setCredentials } from '../../redux/features/Admin/adminSlice';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      // navigate('/admin/dashboard');
    } catch (err) {
      alert(err?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">RK Admin Panel</h2>
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLoading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Index;
