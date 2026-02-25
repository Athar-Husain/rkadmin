import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchAllCitiesWithAreasAdmin
// } from '../locationSlice';
import CityTable from './CityTable';
import CreateCityDialog from './CreateCityDialog';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';

const LocationAdminPage = () => {
  const dispatch = useDispatch();
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);

  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCitiesWithAreasAdmin());
  }, [dispatch]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          City & Area Management
        </Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create City
        </Button>
      </Box>

      <CityTable cities={allCitiesWithAreas} loading={isLocationLoading} />

      <CreateCityDialog open={openCreate} onClose={() => setOpenCreate(false)} />
    </Box>
  );
};

export default LocationAdminPage;
