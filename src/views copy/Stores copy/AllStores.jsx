import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Card, Avatar, Stack, alpha, Chip, Tooltip, IconButton, Switch, Button } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  StorefrontTwoTone as StoreIcon,
  LocationOnTwoTone as LocationIcon,
  CheckCircleTwoTone as ActiveIcon,
  BlockTwoTone as InactiveIcon,
  EditTwoTone as EditIcon,
  VisibilityTwoTone as ViewIcon,
  AddTwoTone as AddIcon
} from '@mui/icons-material';

import { fetchAllStoresAdmin, toggleStoreStatusAdmin } from '../../redux/features/Stores/StoreSlice';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  primary: '#4318FF',
  success: '#05CD99',
  error: '#EE5D50',
  inactive: '#A3AED0',
  bg: '#F4F7FE',
  text: '#1B254B'
};

const AllStores = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stores, isLoading } = useSelector((state) => state.store);

  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  // ============================
  // KPI Metrics
  // ============================
  const kpis = useMemo(() => {
    const active = stores.filter((s) => s.isActive).length;
    const inactive = stores.length - active;

    return {
      total: stores.length,
      active,
      inactive
    };
  }, [stores]);

  // ============================
  // Rows
  // ============================
  const rows = useMemo(
    () =>
      stores.map((s) => ({
        id: s._id,
        name: s.name,
        code: s.code,
        type: s.type,
        city: s.location?.city,
        area: s.location?.area,
        phone: s.contact?.phone,
        isActive: s.isActive,
        createdAt: s.createdAt
      })),
    [stores]
  );

  // ============================
  // Columns
  // ============================
  const columns = [
    {
      field: 'name',
      headerName: 'STORE',
      flex: 1.8,
      minWidth: 250,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: alpha(COLORS.primary, 0.15),
              color: COLORS.primary,
              fontWeight: 800
            }}
          >
            <StoreIcon />
          </Avatar>
          <Box>
            <Typography fontWeight={800} noWrap>
              {p.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Code: {p.row.code}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'type',
      headerName: 'TYPE',
      flex: 1,
      renderCell: (p) => (
        <Chip
          label={p.value}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: alpha(COLORS.primary, 0.12),
            color: COLORS.primary,
            letterSpacing: '0.05em'
          }}
        />
      )
    },
    {
      field: 'location',
      headerName: 'LOCATION',
      flex: 1.5,
      renderCell: (p) => (
        <Stack spacing={0.3}>
          <Typography fontWeight={700}>
            {p.row.city}, {p.row.area}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            📞 {p.row.phone}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'isActive',
      headerName: 'STATUS',
      flex: 1,
      renderCell: (p) => {
        const active = p.value;
        return (
          <Chip
            icon={active ? <ActiveIcon /> : <InactiveIcon />}
            label={active ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: alpha(active ? COLORS.success : COLORS.error, 0.15),
              color: active ? COLORS.success : COLORS.error
            }}
          />
        );
      }
    },
    {
      field: 'toggle',
      headerName: 'TOGGLE',
      width: 110,
      renderCell: (p) => <Switch checked={p.row.isActive} onChange={() => dispatch(toggleStoreStatusAdmin(p.row.id))} color="success" />
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACTIONS',
      width: 140,
      getActions: (p) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Store">
              <ViewIcon color="primary" onClick={() => navigate(`/store/view/${p.row.id}`)} />
            </Tooltip>
          }
          label="View"
          onClick={() => console.log('View', p.row.id)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit Store">
              <EditIcon color="warning" onClick={() => navigate(`/store/edit/${p.row.id}`)} />
            </Tooltip>
          }
          label="Edit"
          onClick={() => console.log('Edit', p.row.id)}
        />
      ]
    }
  ];

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={900}>
          Stores Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 700 }}
          onClick={() => console.log('Create Store')}
        >
          Create Store
        </Button>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'TOTAL STORES', val: kpis.total, col: COLORS.primary },
          { label: 'ACTIVE', val: kpis.active, col: COLORS.success },
          { label: 'INACTIVE', val: kpis.inactive, col: COLORS.error }
        ].map((k, i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {k.label}
                </Typography>
                <Typography variant="h4" fontWeight={900} color={k.col}>
                  {k.val}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Card sx={{ borderRadius: 3 }}>
        <Box sx={{ height: 720 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[10, 20, 50]}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(COLORS.primary, 0.08),
                fontWeight: 800
              }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AllStores;
