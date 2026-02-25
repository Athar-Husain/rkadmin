import { useDispatch, useSelector } from 'react-redux';
import { createStoreAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreForm from './StoreForm';

const CreateStore = () => {
  const dispatch = useDispatch();
  const { isStoreLoading } = useSelector((state) => state.store);

  const handleCreate = (data) => {
    dispatch(createStoreAdmin(data));
  };

  return <StoreForm title="Register New Store" onSubmit={handleCreate} isLoading={isStoreLoading} />;
};

export default CreateStore;
