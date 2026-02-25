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
  Tooltip,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  PictureAsPdfRounded as PdfIcon,
  DescriptionRounded as ExcelIcon,
  PeopleAltRounded as PeopleIcon,
  FiberManualRecord as StatusIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersAdmin } from '../../redux/features/Users/UserSlice';

const AllUsers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { users = [], isUserLoading, isUserError, message } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  // Transform data for DataGrid
  // const rows = useMemo(() => {
  //   return users.map((u, index) => ({
  //     ...u,
  //     id: u._id,
  //     sl: index + 1,
  //     fullName: `${u.firstName || ''} ${u.lastName || ''}`,
  //     status: u.isActive ? 'Active' : 'Pending',
  //     referral: u.referredBy ? `${u.referredBy.firstName} ${u.referredBy.lastName}` : 'N/A'
  //   }));
  // }, [users]);

  // Transform data for DataGrid
  const rows = useMemo(() => {
    return users.map((u, index) => ({
      ...u,
      id: u._id,
      sl: index + 1,
      fullName: u.name,
      phone: u.mobile,
      status: u.isActive ? 'Active' : 'Pending',
      referral: u.referralCode || 'N/A',
      notifications: u.preferences?.notifications ? 'Yes' : 'No',
      smsAlerts: u.preferences?.smsAlerts ? 'Yes' : 'No',
      verified: u.isVerified ? 'Yes' : 'No'
    }));
  }, [users]);

  // KPI Calculations
  const activeUsers = useMemo(() => rows.filter((r) => r.status === 'Active').length, [rows]);
  const verifiedUsers = useMemo(() => rows.filter((r) => r.verified === 'Yes').length, [rows]);
  const totalUsers = rows.length;

  const columns = [
    { field: 'sl', headerName: 'SL', width: 60 },
    {
      field: 'fullName',
      headerName: 'USER',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: '0.9rem',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            {params.row.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#1B2559">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { field: 'phone', headerName: 'PHONE', flex: 1 },
    { field: 'city', headerName: 'CITY', flex: 1 },
    { field: 'area', headerName: 'AREA', flex: 1 },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.8,
      renderCell: (params) => {
        const isActive = params.value === 'Active';
        return (
          <Chip
            icon={<StatusIcon sx={{ fontSize: '10px !important', color: isActive ? '#01B574' : '#FFB547' }} />}
            label={params.value}
            size="small"
            sx={{
              bgcolor: alpha(isActive ? '#01B574' : '#FFB547', 0.1),
              color: isActive ? '#01B574' : '#FFB547',
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: '10px'
            }}
          />
        );
      }
    },
    { field: 'verified', headerName: 'VERIFIED', flex: 0.8 },
    { field: 'walletBalance', headerName: 'WALLET', flex: 0.8 },
    { field: 'notifications', headerName: 'NOTIFICATIONS', flex: 1 },
    { field: 'smsAlerts', headerName: 'SMS ALERTS', flex: 1 },
    { field: 'userType', headerName: 'USER TYPE', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'JOINED DATE',
      flex: 1,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A')
    }
  ];

  // Updated KPI Cards
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} sm={6} md={4}>
      <KPICard title="Total Users" value={totalUsers} icon={<PeopleIcon />} color="#4318FF" />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <KPICard title="Active Users" value={activeUsers} icon={<PeopleIcon />} color="#01B574" />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <KPICard title="Verified Users" value={verifiedUsers} icon={<PeopleIcon />} color="#FFB547" />
    </Grid>
  </Grid>;

  // Update PDF & Excel Export
  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          'SL',
          'Name',
          'Email',
          'Phone',
          'City',
          'Area',
          'Status',
          'Verified',
          'Wallet',
          'Notifications',
          'SMS Alerts',
          'User Type',
          'Joined'
        ]
      ],
      body: rows.map((r) => [
        r.sl,
        r.fullName,
        r.email,
        r.phone,
        r.city,
        r.area,
        r.status,
        r.verified,
        r.walletBalance,
        r.notifications,
        r.smsAlerts,
        r.userType,
        new Date(r.createdAt).toLocaleDateString()
      ]),
      theme: 'grid',
      headStyles: { fill: [67, 24, 255] }
    });
    doc.save('users_list.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rows.map(
        ({ sl, fullName, email, phone, city, area, status, verified, walletBalance, notifications, smsAlerts, userType, createdAt }) => ({
          sl,
          fullName,
          email,
          phone,
          city,
          area,
          status,
          verified,
          walletBalance,
          notifications,
          smsAlerts,
          userType,
          joined: new Date(createdAt).toLocaleDateString()
        })
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users_export.xlsx');
  };

  // KPI Card Component
  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: '24px', display: 'flex', alignItems: 'center', bgcolor: '#fff', border: '1px solid #F4F7FE' }}
    >
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} color="#1B2559">
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559' }}>
              User Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed overview of all registered users
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={exportPDF}
              sx={{ borderRadius: '12px', color: '#1B2559', borderColor: '#E0E5F2' }}
            >
              PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<ExcelIcon />}
              onClick={exportExcel}
              sx={{ bgcolor: '#01B574', borderRadius: '12px', fontWeight: 700 }}
            >
              Excel
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Total Users" value={totalUsers} icon={<PeopleIcon />} color="#4318FF" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Active Users" value={activeUsers} icon={<PeopleIcon />} color="#01B574" />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, bgcolor: '#fff', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)' }}>
          {isUserLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading user records...</Typography>
            </Box>
          ) : isUserError ? (
            <Alert severity="error" sx={{ borderRadius: '16px' }}>
              {message}
            </Alert>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              rowHeight={72}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid #F4F7FE',
                  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 800, color: 'text.disabled', fontSize: '0.7rem' }
                },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
                '& .MuiDataGrid-row:hover': { bgcolor: alpha('#4318FF', 0.02) }
              }}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AllUsers;
