import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Switch,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  AddLocationAltTwoTone,
  DeleteSweepTwoTone,
  SearchTwoTone,
  LocationCityTwoTone,
  PushPinTwoTone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCitiesWithAreasAdmin,
  toggleCityStatusAdmin,
  toggleAreaStatusAdmin,
  removeAreaFromCityAdmin
} from '../../redux/features/Locations/LocationSlice';

// Dialog imports
import { AddCityDialog, AddAreaDialog } from './LocationDialogs';

// Main Component
const LocationManager = () => {
  const dispatch = useDispatch();
  const { allCitiesWithAreas } = useSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayTerm, setDisplayTerm] = useState('');
  const [openAddCityDialog, setOpenAddCityDialog] = useState(false);
  const [openAddAreaDialog, setOpenAddAreaDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCitiesWithAreasAdmin());
  }, [dispatch]);

  const debouncedSearch = useMemo(() => debounce((value) => setSearchTerm(value), 300), []);

  const handleSearchChange = (e) => {
    setDisplayTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const filteredData = allCitiesWithAreas.filter((item) => item.city.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenAddCityDialog = () => setOpenAddCityDialog(true);
  const handleCloseAddCityDialog = () => setOpenAddCityDialog(false);

  const handleOpenAddAreaDialog = (cityName) => {
    setSelectedCity(cityName);
    setOpenAddAreaDialog(true);
  };

  const handleCloseAddAreaDialog = () => setOpenAddAreaDialog(false);

  const handleAddCity = (data) => {
    // Dispatch the action to add the city (write the action in your Redux slice if needed)
    dispatch(addCity(data)); // Make sure this action is implemented in your redux slice
    handleCloseAddCityDialog();
  };

  const handleAddArea = (data) => {
    // Dispatch the action to add the area (write the action in your Redux slice if needed)
    dispatch(addArea({ ...data, city: selectedCity }));
    handleCloseAddAreaDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Typography variant="h4" fontWeight={900}>
            Service Locations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location Control Center for RK Electronics
          </Typography>
        </motion.div>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          startIcon={<AddLocationAltTwoTone />}
          sx={{ borderRadius: '12px', px: 3, py: 1.2 }}
          onClick={handleOpenAddCityDialog}
        >
          Create New City
        </Button>
      </Stack>

      <Paper
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #E0E4E8', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
          <TextField
            fullWidth
            placeholder="Search by city name..."
            size="small"
            value={displayTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoTone color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 800 }}>City / District</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="center">
                  Coverage
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Service Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((city) => (
                <CityRow key={city._id} cityData={city} handleOpenAddAreaDialog={handleOpenAddAreaDialog} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add City Dialog */}
      <AddCityDialog open={openAddCityDialog} onClose={handleCloseAddCityDialog} onSubmit={handleAddCity} />

      {/* Add Area Dialog */}
      {selectedCity && (
        <AddAreaDialog open={openAddAreaDialog} onClose={handleCloseAddAreaDialog} onSubmit={handleAddArea} cityName={selectedCity} />
      )}
    </Container>
  );
};

export default LocationManager;
