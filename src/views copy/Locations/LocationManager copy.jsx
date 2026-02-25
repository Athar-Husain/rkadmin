import React, { useEffect, useState } from 'react';
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
  Dialog,
  Avatar
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  AddLocationAltTwoTone,
  EditTwoTone,
  DeleteSweepTwoTone,
  SearchTwoTone,
  LocationCityTwoTone,
  PushPinTwoTone
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCitiesWithAreasAdmin,
  toggleCityStatusAdmin,
  toggleAreaStatusAdmin,
  removeAreaFromCityAdmin
} from '../../redux/features/Locations/LocationSlice';

// --- Row Component for Cities ---
const CityRow = ({ cityData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const refresh = () => dispatch(fetchAllCitiesWithAreasAdmin());

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
    if (!window.confirm(`Remove "${areaName}" from ${cityData.city}?`)) return;

    try {
      setLoading(true);
      await dispatch(removeAreaFromCityAdmin({ city: cityData.city, area: areaName })).unwrap();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          bgcolor: open ? 'rgba(99,102,241,0.04)' : 'inherit',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.25s ease'
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
              <LocationCityTwoTone
                sx={{
                  fontSize: '1.2rem',
                  color: cityData.isActive ? 'success.main' : 'grey.500'
                }}
              />
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
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Typography variant="caption" fontWeight={800} color={cityData.isActive ? 'success.main' : 'text.secondary'}>
              {cityData.isActive ? 'LIVE' : 'OFFLINE'}
            </Typography>

            <Switch checked={cityData.isActive} onChange={handleToggleCity} disabled={loading} color="success" />
          </Stack>
        </TableCell>
      </TableRow>

      {/* AREAS */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2, p: 2, borderRadius: 2, border: '1px solid #eee' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography fontWeight={800}>Areas in {cityData.city}</Typography>

                <Button size="small" startIcon={<AddLocationAltTwoTone />} variant="contained" sx={{ borderRadius: 2 }}>
                  Add Area
                </Button>
              </Stack>

              {cityData.areas?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No areas added yet
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Area</TableCell>
                      <TableCell>Pincodes</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cityData.areas.map((area) => (
                      <TableRow key={area._id}>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <PushPinTwoTone fontSize="small" />
                            <Typography variant="body2">{area.name}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          {area.pincodes?.map((p) => (
                            <Chip key={p} label={p} size="small" sx={{ mr: 0.5 }} />
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

                        <TableCell align="right">
                          <Tooltip title="Remove Area">
                            <IconButton size="small" color="error" onClick={() => handleDeleteArea(area.name)} disabled={loading}>
                              <DeleteSweepTwoTone fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// --- Main Dashboard Component ---
const LocationManager = () => {
  const dispatch = useDispatch();
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllCitiesWithAreasAdmin());
  }, [dispatch]);

  console.log('allCitiesWithAreas', allCitiesWithAreas);

  const filteredData = allCitiesWithAreas.filter((item) => item.city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Service Locations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage cities and neighborhoods for RK Electronics delivery/service
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddLocationAltTwoTone />} sx={{ borderRadius: '12px', px: 3, py: 1.2 }}>
          Create New City
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #E0E4E8', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
          <TextField
            fullWidth
            placeholder="Search by city name..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoTone color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '10px' }
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
                <CityRow key={city._id} cityData={city} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default LocationManager;
