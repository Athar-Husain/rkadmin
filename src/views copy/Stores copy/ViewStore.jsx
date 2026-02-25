import { Card, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';

const ViewStore = ({ storeId }) => {
  const { store } = useSelector((state) => state.store);
  // Assume useEffect fetches store by ID...

  if (!store) return <Typography>Loading...</Typography>;

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={800}>
          {store.name}
        </Typography>
        <Chip label={store.isActive ? 'Active' : 'Inactive'} color={store.isActive ? 'success' : 'error'} />
      </Stack>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Store Code" secondary={store.code} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Location" secondary={`${store.location.area}, ${store.location.city}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Contact" secondary={store.contact.phone} />
        </ListItem>
      </List>
    </Card>
  );
};

export default ViewStore;
