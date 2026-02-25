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
  Tooltip,
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

import { AddCityDialog, AddAreaDialog } from './LocationDialogs';

// --- NEW IMPORTS FROM YOUR PACKAGE.JSON ---
import { motion, AnimatePresence } from 'framer-motion'; // For smooth UI
import Swal from 'sweetalert2'; // For professional alerts
import debounce from 'lodash.debounce'; // For search optimization

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCitiesWithAreasAdmin,
  toggleCityStatusAdmin,
  toggleAreaStatusAdmin,
  removeAreaFromCityAdmin,
  createCityAdmin,
  addAreasToCityAdmin
} from '../../redux/features/Locations/LocationSlice';

const CityRow = ({ cityData, handleOpenAddAreaDialog }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const refresh = () => dispatch(fetchAllCitiesWithAreasAdmin());
  //   const refresh = () => dispatch(fetchAllCitiesWithAreasAdmin());

  const handleToggleCity = async () => {
    try {
      setLoading(true);
      await dispatch(toggleCityStatusAdmin(cityData.city)).unwrap();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArea = async (areaName) => {
    try {
      setLoading(true);
      await dispatch(toggleAreaStatusAdmin({ city: cityData.city, area: areaName })).unwrap();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArea = async (areaName) => {
    // Enhanced using SweetAlert2 from your package.json
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove "${areaName}" from ${cityData.city}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await dispatch(removeAreaFromCityAdmin({ city: cityData.city, area: areaName })).unwrap();
        refresh();
        Swal.fire('Deleted!', 'Area has been removed.', 'success');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <TableRow
        component={motion.tr} // Framer Motion Integration
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0.5 : 1 }}
        sx={{
          '& > *': { borderBottom: 'unset' },
          bgcolor: open ? 'rgba(99,102,241,0.04)' : 'inherit',
          position: 'relative'
        }}
      >
        <TableCell width={48}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: cityData.isActive ? 'success.light' : 'grey.200',
                width: 32,
                height: 32
              }}
            >
              <LocationCityTwoTone sx={{ fontSize: '1.2rem', color: cityData.isActive ? 'success.main' : 'grey.500' }} />
            </Avatar>
            <Typography fontWeight={800}>{cityData.city}</Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">
          <Chip
            label={`${cityData.areas?.length || 0} Areas`}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: cityData.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)',
              color: cityData.isActive ? 'success.main' : 'text.secondary'
            }}
          />
        </TableCell>

        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            <Typography variant="caption" fontWeight={800} color={cityData.isActive ? 'success.main' : 'text.secondary'}>
              {cityData.isActive ? 'LIVE' : 'OFFLINE'}
            </Typography>
            <Switch checked={cityData.isActive} onChange={handleToggleCity} disabled={loading} color="success" />
          </Stack>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <AnimatePresence>
              <Box
                component={motion.div}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                sx={{ m: 2, p: 2, borderRadius: 2, border: '1px solid #eee', bgcolor: 'white' }}
              >
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography fontWeight={800} color="primary">
                    Areas in {cityData.city}
                  </Typography>
                  {/* <Button size="small" startIcon={<AddLocationAltTwoTone />} variant="contained" sx={{ borderRadius: 2 }}>
                    Add Area
                  </Button> */}
                  <Button
                    size="small"
                    startIcon={<AddLocationAltTwoTone />}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleOpenAddAreaDialog(cityData.city)} // Pass the city name to the dialog handler
                  >
                    Add Area
                  </Button>
                </Stack>

                {cityData.areas?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No areas added yet
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Area</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Pincodes</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          Status
                        </TableCell>
                        {/* <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Actions
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cityData.areas.map((area) => (
                        <TableRow key={area._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <PushPinTwoTone fontSize="small" sx={{ color: 'text.secondary' }} />
                              <Typography variant="body2">{area.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {area.pincodes?.map((p) => (
                              <Chip key={p} label={p} size="small" sx={{ mr: 0.5, height: 20, fontSize: '0.7rem' }} />
                            ))}
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              size="small"
                              checked={area.isActive}
                              onChange={() => handleToggleArea(area.name)}
                              disabled={loading}
                              color="success"
                            />
                          </TableCell>
                          {/* <TableCell align="right">
                            <Tooltip title="Remove Area">
                              <IconButton size="small" color="error" onClick={() => handleDeleteArea(area.name)} disabled={loading}>
                                <DeleteSweepTwoTone fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </AnimatePresence>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const LocationManager = () => {
  const dispatch = useDispatch();
  const { allCitiesWithAreas } = useSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayTerm, setDisplayTerm] = useState('');
  const [openAddCityDialog, setOpenAddCityDialog] = useState(false);
  const [openAddAreaDialog, setOpenAddAreaDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const refresh = () => dispatch(fetchAllCitiesWithAreasAdmin());
  useEffect(() => {
    dispatch(fetchAllCitiesWithAreasAdmin());
  }, [dispatch]);

  // Optimized Search using lodash.debounce from your package.json
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

    //   const refresh = () => dispatch(fetchAllCitiesWithAreasAdmin());
  };

  const handleCloseAddAreaDialog = () => setOpenAddAreaDialog(false);

  const handleAddCity = async (data) => {
    // Dispatch the action to add the city (write the action in your Redux slice if needed)
    await dispatch(createCityAdmin(data)); // Make sure this action is implemented in your redux slice
    handleCloseAddCityDialog();
    refresh();
  };

  const handleAddArea = async (data) => {
    // Dispatch the action to add the area (write the action in your Redux slice if needed)
    await dispatch(addAreasToCityAdmin({ ...data, city: selectedCity }));
    console.log('add area ', data);
    handleCloseAddAreaDialog();
    refresh();
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
