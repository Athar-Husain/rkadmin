import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreByIdAdmin, updateStoreAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreForm from './StoreForm';
import { toast } from 'react-toastify';

const UpdateStore = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { store, isStoreLoading } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(fetchStoreByIdAdmin(id));
  }, [id, dispatch]);

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateStoreAdmin({ id, data })).unwrap();
      toast.success('Store updated successfully!');
      navigate('/stores');
    } catch (err) {
      toast.error(err.message || 'Failed to update store');
    }
  };

  return <StoreForm title="Edit Store Details" initialData={store} onSubmit={handleUpdate} isLoading={isStoreLoading} />;
};

export default UpdateStore;
