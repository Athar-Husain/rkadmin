import { Card, Divider, List, ListItem, Typography, ListItemText, Chip, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreByIdAdmin } from '../../redux/features/Stores/StoreSlice';
import { useParams } from 'react-router-dom';

const ViewStore = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // assuming your route is /store/view/:id
  const { store, isStoreLoading } = useSelector((state) => state.store);

  //   console.log("store", store)

  useEffect(() => {
    if (id) {
      dispatch(fetchStoreByIdAdmin(id));
    }
  }, [id, dispatch]);

  if (isStoreLoading) return <Typography>Loading...</Typography>;

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={800}>
          {store?.name}
        </Typography>
        <Chip label={store?.isActive ? 'Active' : 'Inactive'} color={store?.isActive ? 'success' : 'error'} />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem>
          <ListItemText primary="Store Code" secondary={store?.code || '-'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Location" secondary={`${store?.location?.area || '-'}, ${store?.location?.city || '-'}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Phone" secondary={store?.contact?.phone || '-'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Email" secondary={store?.contact?.email || '-'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Type" secondary={store?.type || '-'} />
        </ListItem>
      </List>
    </Card>
  );
};

export default ViewStore;
