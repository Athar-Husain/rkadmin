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
  ReportProblemRounded as WarningIcon,
  WifiTetheringRounded as ConnectionIcon,
  FiberManualRecord as StatusIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../component/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomers } from '../../redux/features/Customers/CustomerSlice';

const All = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { allCustomers = [], isCustomerLoading, isCustomerError, message } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  // Transform Data for DataGrid based on your API Structure
  const rows = useMemo(() => {
    return allCustomers.map((c, index) => ({
      ...c,
      id: c._id, // DataGrid needs a unique ID
      sl: index + 1,
      fullName: `${c.firstName || ''} ${c.lastName || ''}`,
      // Logical check: If they have an active connection, they are 'Active'
      status: c.activeConnection ? 'Active' : 'Pending',
      connectionCount: c.connections?.length || 0,
      // Defaulting these as your current API sample shows empty arrays/missing fields
      planName: c.activePlanName || 'No Plan',
      complaintCount: c.openComplaints || 0
    }));
  }, [allCustomers]);

  // KPI Calculations
  const activeSubscribers = useMemo(() => rows.filter((r) => r.status === 'Active').length, [rows]);
  const totalConnections = useMemo(() => rows.reduce((acc, curr) => acc + curr.connectionCount, 0), [rows]);

  const columns = [
    {
      field: 'sl',
      headerName: 'SL',
      width: 60,
      alignItems: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ alignItems: 'center' }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'fullName',
      headerName: 'CUSTOMER',
      flex: 1.5,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          //   justifyContent="center" // Add this to keep it vertically centered
          sx={{ height: '100%', py: 1 }} // Add padding to prevent clipping
        >
          <Avatar
            sx={{
              width: 36, // Slightly larger looks more professional
              height: 36,
              fontSize: '0.9rem',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            {params.row.firstName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ lineHeight: 1 }}>
            {/* Tighten line height for better spacing */}
            <Typography
              variant="body2"
              fontWeight={700}
              color="#1B2559"
              sx={{ mb: 0.5, display: 'block' }} // Force block and add tiny bottom margin
            >
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', opacity: 0.8 }}>
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { field: 'phone', headerName: 'PHONE', flex: 1 },
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
    {
      field: 'connectionCount',
      headerName: 'CONNECTIONS',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title={`${params.value} Linked Devices`}>
          <Chip label={params.value} size="small" sx={{ fontWeight: 700, bgcolor: '#F4F7FE' }} />
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'JOINED DATE',
      flex: 1,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A')
    }
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['SL', 'Name', 'Email', 'Phone', 'Status', 'Connections', 'Joined']],
      body: rows.map((r) => [r.sl, r.fullName, r.email, r.phone, r.status, r.connectionCount, new Date(r.createdAt).toLocaleDateString()]),
      theme: 'grid',
      headStyles: { fill: [67, 24, 255] }
    });
    doc.save('customers_list.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rows.map(({ sl, fullName, email, phone, status }) => ({ sl, fullName, email, phone, status }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customer_export.xlsx');
  };

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
      {/* <Breadcrumbs links={[{ label: 'Dashboard', to: '/' }, { label: 'Customers' }, { label: 'List' }]} divider /> */}

      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559' }}>
              Customer Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed overview of all registered clients
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
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Total Clients" value={rows.length} icon={<PeopleIcon />} color="#4318FF" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Active Subs" value={activeSubscribers} icon={<ConnectionIcon />} color="#01B574" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Live Links" value={totalConnections} icon={<WarningIcon />} color="#FFB547" />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, bgcolor: '#fff', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)' }}>
          {isCustomerLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading customer records...</Typography>
            </Box>
          ) : isCustomerError ? (
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

export default All;
