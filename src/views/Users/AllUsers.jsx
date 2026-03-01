import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Stack,
  Avatar,
  alpha,
  useTheme,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Tooltip
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  PictureAsPdfRounded as PdfIcon,
  DescriptionRounded as ExcelIcon,
  PeopleAltRounded as PeopleIcon,
  FiberManualRecord as StatusIcon,
  VerifiedUserRounded as VerifiedIcon,
  // AccountBalanceWalletRounded as WalletIcon,
  DownloadRounded as DownloadIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersAdmin } from '../../redux/features/Users/UserSlice';

// Custom Table Toolbar for a cleaner look
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
      <Typography variant="subtitle1" fontWeight={700} color="#1B2559">
        User List
      </Typography>
      <GridToolbarQuickFilter
        sx={{
          '& .MuiInputBase-root': { borderRadius: '12px', bgcolor: '#F4F7FE', px: 1 }
        }}
      />
    </GridToolbarContainer>
  );
}

const AllUsers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { users = [], isUserLoading, isUserError, message } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  /* ---------------- DATA TRANSFORMATION ---------------- */
  const rows = useMemo(() => {
    return users.map((u, index) => ({
      id: u._id,
      sl: index + 1,
      fullName: u.name || '—',
      email: u.email || '—',
      phone: u.mobile || '—',
      cityName: u.city?.city || '—',
      areaName: u.areaName || '—',
      // walletBalance: u.walletBalance ?? 0,
      status: u.isActive ? 'Active' : 'Pending',
      verified: u.isVerified,
      notifications: u.preferences?.notifications ? 'Enabled' : 'Disabled',
      smsAlerts: u.preferences?.smsAlerts ? 'Enabled' : 'Disabled',
      createdAt: u.createdAt || u.updatedAt || new Date().toISOString()
    }));
  }, [users]);

  /* ---------------- KPI CALCULATIONS ---------------- */
  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'Active').length,
      verified: rows.filter((r) => r.verified).length
    }),
    [rows]
  );

  /* ---------------- COLUMNS DEFINITION ---------------- */
  const columns = [
    { field: 'sl', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
    {
      field: 'fullName',
      headerName: 'CUSTOMER',
      minWidth: 250,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" height="100%">
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: '0.85rem',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            {params.value?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#1B2559">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { field: 'phone', headerName: 'PHONE', minWidth: 140 },
    {
      field: 'location',
      headerName: 'LOCATION',
      minWidth: 200,
      valueGetter: (params, row) => `${row.cityName}, ${row.areaName}`
    },
    // {
    //   field: 'walletBalance',
    //   headerName: 'WALLET',
    //   minWidth: 110,
    //   renderCell: (params) => (
    //     <Typography variant="body2" fontWeight={700} color="#1B2559">
    //       ₹{params.value.toLocaleString('en-IN')}
    //     </Typography>
    //   )
    // },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 120,
      renderCell: (params) => {
        const isActive = params.value === 'Active';
        return (
          <Chip
            label={params.value}
            size="small"
            icon={<StatusIcon sx={{ fontSize: '10px !important' }} />}
            sx={{
              bgcolor: alpha(isActive ? '#01B574' : '#FFB547', 0.1),
              color: isActive ? '#01B574' : '#FFB547',
              fontWeight: 800,
              fontSize: '10px',
              px: 1
            }}
          />
        );
      }
    },
    {
      field: 'verified',
      headerName: 'Email Verified',
      minWidth: 100,
      renderCell: (params) =>
        params.value ? (
          <Tooltip title="Email Verified">
            <VerifiedIcon sx={{ color: '#01B574' }} />
          </Tooltip>
        ) : (
          <Typography variant="caption" color="text.disabled">
            —
          </Typography>
        )
    },
    {
      field: 'createdAt',
      headerName: 'JOINED',
      minWidth: 120,
      valueFormatter: (value) => new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  ];

  /* ---------------- EXPORT LOGIC ---------------- */
  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    autoTable(doc, {
      head: [['SL', 'Name', 'Email', 'Phone', 'City', 'Status']],
      body: rows.map((r) => [r.sl, r.fullName, r.email, r.phone, r.cityName, r.status]),
      theme: 'striped',
      headStyles: { fill: [67, 24, 255] }
    });
    doc.save(`User_Directory_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'User_Export.xlsx');
  };

  /* ---------------- KPI CARD COMPONENT ---------------- */
  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        border: '1px solid #F4F7FE',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 56, height: 56, mr: 2.5 }}>
        {React.cloneElement(icon, { sx: { fontSize: 28 } })}
      </Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} color="#1B2559">
          {value.toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 5 }}>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#1B2559" sx={{ letterSpacing: '-1px' }}>
              User Directory
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Manage and analyze your customer base and their engagement.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportPDF}
              sx={{ borderRadius: '14px', px: 3, borderColor: '#E0E5F2', color: '#1B2559', fontWeight: 700 }}
            >
              PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<ExcelIcon />}
              onClick={exportExcel}
              sx={{ bgcolor: '#01B574', borderRadius: '14px', px: 3, fontWeight: 700, '&:hover': { bgcolor: '#01945d' } }}
            >
              Export Excel
            </Button>
          </Stack>
        </Stack>

        {/* ANALYTICS SECTION */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Total Customer" value={stats.total} icon={<PeopleIcon />} color="#4318FF" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Active Status" value={stats.active} icon={<StatusIcon />} color="#01B574" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Email Verified" value={stats.verified} icon={<VerifiedIcon />} color="#FFB547" />
          </Grid>
        </Grid>

        {/* DATA TABLE SECTION */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            p: 1,
            bgcolor: '#fff',
            border: '1px solid #F4F7FE',
            boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)'
          }}
        >
          {isUserLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 10, flexDirection: 'column', gap: 2 }}>
              <CircularProgress thickness={5} size={50} sx={{ color: '#4318FF' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Fetching User Data...
              </Typography>
            </Box>
          ) : isUserError ? (
            <Alert severity="error" variant="filled" sx={{ m: 2, borderRadius: '12px' }}>
              {message}
            </Alert>
          ) : (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                slots={{ toolbar: CustomToolbar }}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                rowHeight={75}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  px: 2,
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: '#fff',
                    borderBottom: '1px solid #F4F7FE',
                    color: '#A3AED0',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '12px'
                  },
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
                  '& .MuiDataGrid-row:hover': { bgcolor: alpha('#4318FF', 0.02), cursor: 'pointer' }
                }}
              />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AllUsers;
