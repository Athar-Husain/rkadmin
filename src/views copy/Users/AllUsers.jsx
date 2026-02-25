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

  /* ---------------- ROW TRANSFORMATION ---------------- */
  // const rows = useMemo(() => {
  //   return users.map((u, index) => ({
  //     ...u,
  //     id: u._id,
  //     sl: index + 1,
  //     fullName: u.name || '—',
  //     phone: u.mobile || '—',
  //     cityName: u.city?.city || '—',
  //     areaName: u.areaName || '—',
  //     status: u.isActive ? 'Active' : 'Pending',
  //     referral: u.referralCode || 'N/A',
  //     notifications: u.preferences?.notifications ? 'Yes' : 'No',
  //     smsAlerts: u.preferences?.smsAlerts ? 'Yes' : 'No',
  //     verified: u.isVerified ? 'Yes' : 'No'
  //   }));
  // }, [users]);

  const rows = useMemo(() => {
    return users.map((u, index) => ({
      id: u._id,
      sl: index + 1,
      fullName: u.name || '—',
      email: u.email || '—',
      phone: u.mobile || '—',
      cityName: u.city?.city || '—',
      areaName: u.areaName || '—',
      walletBalance: u.walletBalance ?? 0,
      userType: u.userType || '—',
      status: u.isActive ? 'Active' : 'Pending',
      verified: u.isVerified ? 'Yes' : 'No',
      notifications: u.preferences?.notifications ? 'Yes' : 'No',
      smsAlerts: u.preferences?.smsAlerts ? 'Yes' : 'No',

      // ⭐ IMPORTANT
      createdAt: u.createdAt || u.updatedAt || 'N/A'
    }));
  }, [users]);

  /* ---------------- KPI CALCULATIONS ---------------- */
  const totalUsers = rows.length;
  const activeUsers = rows.filter((r) => r.status === 'Active').length;
  const verifiedUsers = rows.filter((r) => r.verified === 'Yes').length;

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    { field: 'sl', headerName: 'SL', width: 60 },

    {
      field: 'fullName',
      headerName: 'Customer',
      minWidth: 240,
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
            {params.value?.charAt(0).toUpperCase()}
          </Avatar>
          <Box justifyContent="center">
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

    { field: 'phone', headerName: 'PHONE', minWidth: 140, flex: 1 },

    { field: 'cityName', headerName: 'CITY', minWidth: 140, flex: 1 },

    { field: 'areaName', headerName: 'AREA', minWidth: 160, flex: 1 },

    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => {
        const isActive = params.value === 'Active';
        return (
          <Chip
            icon={
              <StatusIcon
                sx={{
                  fontSize: '10px !important',
                  color: isActive ? '#01B574' : '#FFB547'
                }}
              />
            }
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

    { field: 'verified', headerName: 'VERIFIED', minWidth: 110, flex: 0.8 },

    { field: 'walletBalance', headerName: 'WALLET', minWidth: 120, flex: 0.8 },

    { field: 'notifications', headerName: 'NOTIFICATIONS', minWidth: 140, flex: 1 },

    { field: 'smsAlerts', headerName: 'SMS ALERTS', minWidth: 140, flex: 1 },

    // { field: 'userType', headerName: 'USER TYPE', minWidth: 140, flex: 1 },

    {
      field: 'createdAt',
      headerName: 'JOINED DATE',
      minWidth: 140,
      flex: 1,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A')
    }
  ];

  /* ---------------- EXPORT PDF ---------------- */
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
        r.cityName,
        r.areaName,
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

  /* ---------------- EXPORT EXCEL ---------------- */
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rows.map((r) => ({
        SL: r.sl,
        Name: r.fullName,
        Email: r.email,
        Phone: r.phone,
        City: r.cityName,
        Area: r.areaName,
        Status: r.status,
        Verified: r.verified,
        Wallet: r.walletBalance,
        Notifications: r.notifications,
        SMS_Alerts: r.smsAlerts,
        User_Type: r.userType,
        Joined: new Date(r.createdAt).toLocaleDateString()
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users_export.xlsx');
  };

  /* ---------------- KPI CARD ---------------- */
  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        border: '1px solid #F4F7FE'
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color,
          width: 48,
          height: 48,
          mr: 2
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
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
        {/* HEADER */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#1B2559">
              User Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed overview of all registered users
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<PdfIcon />} onClick={exportPDF} sx={{ borderRadius: '12px' }}>
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

        {/* KPI */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Total Users" value={totalUsers} icon={<PeopleIcon />} color="#4318FF" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Active Users" value={activeUsers} icon={<PeopleIcon />} color="#01B574" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard title="Verified Users" value={verifiedUsers} icon={<PeopleIcon />} color="#FFB547" />
          </Grid>
        </Grid>

        {/* TABLE */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            p: 2,
            bgcolor: '#fff',
            overflowX: 'auto'
          }}
        >
          {isUserLoading ? (
            <Box sx={{ textAlign: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : isUserError ? (
            <Alert severity="error">{message}</Alert>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              rowHeight={72}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                minWidth: 1100,
                '& .MuiDataGrid-columnHeaders': {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#fff'
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: '#FAFBFF'
                }
              }}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AllUsers;
