import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  alpha,
  useTheme,
  Badge
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';

const STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Escalated', value: 'Escalated' },
  { label: 'Closed', value: 'Closed' }
];

const TicketHeader = ({ currentView, onViewChange, title, onFilterChange, onAddTicketClick }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasStatus = filters.status !== '';
    const hasStart = filters.startDate !== null;
    const hasEnd = filters.endDate !== null;
    setIsDirty(hasStatus || hasStart || hasEnd);
  }, [filters]);

  const handleApplyFilters = () => {
    if (onFilterChange) onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters = { status: '', startDate: null, endDate: null };
    setFilters(defaultFilters);
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        p: 1
      }}
    >
      {/* Left Section: Title & View Switcher */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
          {title}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />

        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={(e, val) => val && onViewChange(val)}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            '& .MuiToggleButton-root': {
              px: 2,
              border: 'none',
              borderRadius: '8px !important',
              mx: 0.5,
              textTransform: 'none',
              fontWeight: 600,
              '&.Mui-selected': {
                bgcolor: '#fff',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                color: 'primary.main',
                '&:hover': { bgcolor: '#fff' }
              }
            }
          }}
        >
          <ToggleButton value="status">
            <DashboardIcon sx={{ fontSize: 18, mr: 1 }} /> Status
          </ToggleButton>
          <ToggleButton value="user">
            <PeopleIcon sx={{ fontSize: 18, mr: 1 }} /> Team
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Right Section: Filters & Actions */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={1} sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), p: 0.5, borderRadius: '10px' }}>
            <DatePicker
              label="From"
              value={filters.startDate}
              onChange={(v) => setFilters((p) => ({ ...p, startDate: v }))}
              slotProps={{ textField: { size: 'small', variant: 'standard', sx: { width: 110, px: 1 } } }}
            />
            <DatePicker
              label="To"
              value={filters.endDate}
              onChange={(v) => setFilters((p) => ({ ...p, endDate: v }))}
              slotProps={{ textField: { size: 'small', variant: 'standard', sx: { width: 110, px: 1 } } }}
            />
          </Stack>
        </LocalizationProvider>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={filters.status}
            displayEmpty
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            sx={{ borderRadius: '10px', bgcolor: alpha(theme.palette.grey[100], 0.5) }}
          >
            {STATUSES.map(({ label, value }) => (
              <MenuItem key={value || 'all'} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Apply Filters">
            <IconButton
              onClick={handleApplyFilters}
              disabled={!isDirty}
              sx={{
                bgcolor: isDirty ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isDirty ? 'primary.main' : 'inherit'
              }}
            >
              <Badge color="error" variant="dot" invisible={!isDirty}>
                <FilterAltIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset">
            <IconButton onClick={handleResetFilters} disabled={!isDirty}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', display: { xs: 'none', sm: 'block' } }} />

        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={onAddTicketClick}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2,
            height: 40
          }}
        >
          New Ticket
        </Button>
      </Stack>
    </Box>
  );
};

export default TicketHeader;
