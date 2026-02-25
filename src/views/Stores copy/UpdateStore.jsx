import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreByIdAdmin, updateStoreAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreForm from './StoreForm';

const UpdateStore = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { store, isStoreLoading } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(fetchStoreByIdAdmin(id));
  }, [id, dispatch]);

  const handleUpdate = (data) => {
    dispatch(updateStoreAdmin({ id, data }));
  };

  return <StoreForm title="Edit Store Details" initialData={store} onSubmit={handleUpdate} isLoading={isStoreLoading} />;
};

export default UpdateStore;
