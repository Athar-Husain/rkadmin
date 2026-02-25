import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStoreAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreForm from './StoreForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isStoreLoading } = useSelector((state) => state.store);

  const handleCreate = async (data) => {
    try {
      await dispatch(createStoreAdmin(data)).unwrap();
    //   toast.success('Store created successfully!');
      navigate('/stores'); // redirect to store list
    } catch (err) {
      toast.error(err.message || 'Failed to create store');
    }
  };

  return <StoreForm title="Register New Store" onSubmit={handleCreate} isLoading={isStoreLoading} />;
};

export default CreateStore;
