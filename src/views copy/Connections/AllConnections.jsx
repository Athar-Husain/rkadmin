import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
  alpha,
  LinearProgress,
  Paper,
  MenuItem,
  TextField,
  Tooltip,
  Chip
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  CallTwoTone as CallIcon,
  WarningAmberRounded as AlertIcon,
  CheckCircleTwoTone as ActiveIcon,
  HistoryTwoTone as HistoryIcon,
  WifiOffTwoTone as OfflineIcon,
  WifiTwoTone as OnlineIcon,
  BoltTwoTone as FastIcon,
  SearchTwoTone as SearchIcon,
  BlockTwoTone as InactiveIcon,
  FilterListTwoTone as FilterIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { getAllConnections } from '../../redux/features/Connection/ConnectionSlice';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

const COLORS = {
  primary: '#4318FF',
  success: '#05CD99',
  error: '#EE5D50',
  warning: '#FFB547',
  inactive: '#A3AED0',
  text: '#1B254B',
  bg: '#F4F7FE'
};

const AllConnections = () => {
  const dispatch = useDispatch();
  const { connections = [], isConnectionLoading } = useSelector((state) => state.connection);

  // Filters and states ...
  // Your existing hooks here

  // Memoized data and filteredData logic unchanged

  const [regionFilter, setRegionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [willExpireFilter, setWillExpireFilter] = useState('none');
  const [expiredSinceFilter, setExpiredSinceFilter] = useState('none');

  useEffect(() => {
    dispatch(getAllConnections());
  }, [dispatch]);

  const rows = useMemo(
    () =>
      connections.map((c) => ({
        ...c,
        id: c._id,
        flatRegion: c.serviceArea?.region || 'N/A',
        networkDesc: c.serviceArea?.description || '',
        flatPrice: c.activePlan?.price || 0,
        flatDuration: c.activePlan?.duration || 0,
        flatStartDate: c.activePlan?.startDate,
        flatEndDate: c.activePlan?.endDate,
        networkStatus: c.serviceArea?.networkStatus || 'Unknown',
        uId: c.userId || 'N/A'
      })),
    [connections]
  );

  const filteredData = useMemo(() => {
    const now = dayjs();
    const today = dayjs().startOf('day');

    return rows.filter((r) => {
      if (regionFilter !== 'all' && r.flatRegion !== regionFilter) return false;
      if (searchQuery && ![r.userName, r.boxId, r.stbNumber, r.uId].some((v) => v?.toLowerCase().includes(searchQuery.toLowerCase())))
        return false;

      const end = r.flatEndDate ? dayjs(r.flatEndDate) : null;
      const isExpired = !end || end.isBefore(now);

      if (willExpireFilter !== 'none') {
        if (!end || !end.isAfter(now)) return false;
        if (willExpireFilter === 'today' && !end.isSame(today, 'day')) return false;
        if (willExpireFilter === 'next7' && !end.isBetween(now, now.add(7, 'day'))) return false;
      }

      if (expiredSinceFilter !== 'none') {
        if (!isExpired) return false;
        if (expiredSinceFilter === 'yesterday' && (!end || !end.isSame(today.subtract(1, 'day'), 'day'))) return false;
        if (expiredSinceFilter === 'last7' && (!end || !end.isBetween(now.subtract(7, 'day'), now))) return false;
        if (expiredSinceFilter === 'last30' && (!end || !end.isBetween(now.subtract(30, 'day'), now))) return false;
      }
      return true;
    });
  }, [rows, regionFilter, searchQuery, willExpireFilter, expiredSinceFilter]);

  const kpis = useMemo(() => {
    const now = dayjs();
    const startOfToday = dayjs().startOf('day');

    return {
      // 1. Status-based: specifically looking for the string 'active'
      activeconnection: rows.filter((r) => r.connectionStatus === 'active').length,

      // 2. Date-based: Plans ending within the next 7 days
      expiringSoon: rows.filter((r) => r.flatEndDate && dayjs(r.flatEndDate).isBetween(now, now.add(7, 'day'), 'day', '[]')).length,

      // 3. Date-based Active: End date is today or in the future
      active: rows.filter((r) => r.flatEndDate && dayjs(r.flatEndDate).isSameOrAfter(startOfToday, 'day')).length,

      // 4. Inactive: No date provided OR date has already passed
      inactive: rows.filter((r) => !r.flatEndDate || dayjs(r.flatEndDate).isBefore(startOfToday, 'day')).length,

      // 5. Network-based: Looking for 'Down' status
      downNodes: rows.filter((r) => r.networkStatus === 'Down').length,

      // 6. Filter-based: Current count of rows visible in the table
      results: filteredData.length
    };
  }, [rows, filteredData]);

  const columns = [
    {
      field: 'userName',
      headerName: 'CUSTOMER & DEVICE',
      flex: 1.5,
      minWidth: 250,
      renderCell: (p) => (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ py: 1 }}>
          <Avatar
            sx={{
              bgcolor: alpha(COLORS.primary, 0.1),
              color: COLORS.primary,
              fontWeight: 700,
              width: 40,
              height: 40
            }}
          >
            {p.value?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={800} noWrap>
              {p.value}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
              Contact: {p.row.contactNo}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
              UID: {p.row.uId}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.primary, fontSize: '0.7rem', display: 'block' }}>
              BOX: {p.row.boxId} • STB: {p.row.stbNumber}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'connectionStatus',
      headerName: 'CONNECTION STATUS',
      flex: 1,
      renderCell: (p) => {
        const status = p.value?.toLowerCase() || 'unknown';

        const isActive = status === 'active';
        const isSuspended = status === 'suspended';
        const isCancelled = status === 'cancelled';

        const label = isActive ? 'Active' : isSuspended ? 'Suspended' : isCancelled ? 'Cancelled' : 'Unknown';

        const color = isActive ? COLORS.success : isSuspended ? COLORS.warning : isCancelled ? COLORS.error : COLORS.primary;

        return (
          <Stack spacing={0.5}>
            <Chip
              label={label}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: alpha(color, 0.15),
                color: color,
                borderRadius: 1.5,
                textTransform: 'capitalize',
                letterSpacing: '0.05em',
                fontFamily: "'Roboto Mono', monospace",
                pl: 1
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Due: ₹{p.row.dueAmount?.toLocaleString() || 0}
            </Typography>
          </Stack>
        );
      }
    },

    {
      field: 'flatRegion',
      headerName: 'REGION & NETWORK',
      flex: 1,
      renderCell: (p) => {
        const isDown = p.row.networkStatus === 'Down';
        const icon = isDown ? <OfflineIcon fontSize="small" sx={{ mr: 0.5 }} /> : <OnlineIcon fontSize="small" sx={{ mr: 0.5 }} />;
        return (
          <Stack spacing={0.5} justifyContent="center">
            <Typography variant="body2" fontWeight={700} noWrap>
              {p.value}
            </Typography>
            <Chip
              icon={icon}
              label={p.row.networkStatus}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: alpha(isDown ? COLORS.error : COLORS.success, 0.15),
                color: isDown ? COLORS.error : COLORS.success,
                borderRadius: 1.5,
                textTransform: 'capitalize',
                letterSpacing: '0.05em',
                fontFamily: "'Roboto Mono', monospace",
                pl: 1
              }}
            />
          </Stack>
        );
      }
    },
    {
      field: 'flatPrice',
      headerName: 'PLAN DETAILS',
      flex: 1.2,
      renderCell: (p) => (
        <Stack spacing={0.3} justifyContent="center">
          <Typography variant="body2" fontWeight={800} color={COLORS.primary} noWrap>
            ₹{p.value?.toLocaleString()}{' '}
            <Typography component="span" variant="caption" color="text.secondary">
              ({p.row.flatDuration}D)
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
            {p.row.flatStartDate ? dayjs(p.row.flatStartDate).format('DD MMM YY') : 'N/A'} -{' '}
            {p.row.flatEndDate ? dayjs(p.row.flatEndDate).format('DD MMM YY') : 'N/A'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'flatEndDate',
      headerName: 'EXPIRY STATUS',
      flex: 1.2,
      renderCell: (p) => {
        const diff = p.value ? dayjs(p.value).diff(dayjs(), 'day') : null;
        const expired = diff === null || diff < 0;

        const statusText = diff === null ? 'NO PLAN' : expired ? `EXPIRED ${Math.abs(diff)}D AGO` : `${diff} DAYS LEFT`;

        return (
          <Box sx={{ width: '100%', pr: 2 }}>
            <Typography
              variant="caption"
              fontWeight={800}
              color={expired ? COLORS.error : COLORS.warning}
              sx={{ textTransform: 'uppercase' }}
            >
              {statusText}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={expired ? 100 : Math.min((diff / 30) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 0.5,
                bgcolor: alpha(COLORS.primary, 0.05),
                '& .MuiLinearProgress-bar': {
                  bgcolor: expired ? COLORS.error : COLORS.success
                }
              }}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACTIONS',
      width: 140,
      getActions: () => [
        <GridActionsCellItem icon={<CallIcon sx={{ color: COLORS.success }} />} label="Call" />,
        <GridActionsCellItem icon={<FastIcon sx={{ color: COLORS.warning }} />} label="Renew" />,
        <GridActionsCellItem icon={<HistoryIcon sx={{ color: COLORS.primary }} />} label="History" />
      ]
    }
  ];

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        {[
          { label: 'TOTAL', val: kpis.activeconnection, icon: <ActiveIcon />, col: COLORS.success },
          { label: 'ACTIVE', val: kpis.active, icon: <ActiveIcon />, col: COLORS.success },
          { label: 'EXPIRING 7D', val: kpis.expiringSoon, icon: <AlertIcon />, col: COLORS.warning },
          { label: 'INACTIVE', val: kpis.inactive, icon: <InactiveIcon />, col: COLORS.inactive },
          { label: 'NETWORK DOWN', val: kpis.downNodes, icon: <OfflineIcon />, col: COLORS.error },
          { label: 'FILTER RESULTS', val: kpis.results, icon: <FilterIcon />, col: COLORS.primary }
        ].map((k, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(67, 24, 255, 0.1)',
                cursor: 'default',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ userSelect: 'none' }}>
                <Avatar sx={{ bgcolor: alpha(k.col, 0.15), color: k.col, width: 40, height: 40 }}>{k.icon}</Avatar>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 0.5 }} noWrap>
                    {k.label}
                  </Typography>
                  <Typography variant="h6" fontWeight={900} sx={{ mt: -0.5 }}>
                    {k.val}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={2}>
          {/* Search */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="Search customer, box, STB"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="disabled" sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          {/* Region */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField select fullWidth size="small" label="Region" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <MenuItem value="all">All Regions</MenuItem>
              {[...new Set(rows.map((r) => r.flatRegion))].map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Will Expire */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Will Expire"
              value={willExpireFilter}
              onChange={(e) => {
                setWillExpireFilter(e.target.value);
                setExpiredSinceFilter('none');
              }}
            >
              <MenuItem value="none">Any Future</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="next7">Next 7 Days</MenuItem>
            </TextField>
          </Grid>
          {/* Expired Plans */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Expired Plans"
              value={expiredSinceFilter}
              onChange={(e) => {
                setExpiredSinceFilter(e.target.value);
                setWillExpireFilter('none');
              }}
            >
              <MenuItem value="none">Any Status</MenuItem>
              <MenuItem value="all">All Expired / No Plan</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7">Last 7 Days</MenuItem>
              <MenuItem value="last30">Last 30 Days</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Grid */}
      <Card sx={{ borderRadius: 3, overflow: 'auto', boxShadow: 'none' }}>
        <Box sx={{ height: 750 }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            loading={isConnectionLoading}
            rowHeight={85}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha(COLORS.primary, 0.1),
                borderBottom: `1px solid ${alpha(COLORS.primary, 0.25)}`
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${alpha(COLORS.primary, 0.1)}`
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${alpha(COLORS.primary, 0.1)}`
              }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AllConnections;
