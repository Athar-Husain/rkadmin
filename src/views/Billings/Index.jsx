import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  alpha,
  Tooltip,
  Chip
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ReactApexChart from 'react-apexcharts';

// Icons
import {
  VisibilityTwoTone as ViewIcon,
  EditTwoTone as EditIcon,
  AccountBalanceWalletTwoTone as WalletIcon,
  ReceiptTwoTone as InvoiceIcon,
  ErrorTwoTone as WarningIcon,
  CloudDownloadTwoTone as ExportIcon,
  AccountBalanceTwoTone as BankIcon,
  FilterListTwoTone as FilterIcon,
  TrendingUpTwoTone as ProfitIcon,
  CreditCardTwoTone as CardIcon
} from '@mui/icons-material';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
  primary: '#4318FF',
  success: '#05CD99',
  error: '#EE5D50',
  warning: '#FFB547',
  bg: '#F4F7FE',
  textMain: '#1B254B',
  textSecondary: '#A3AED0'
};

const BillingDashboard = () => {
  const [filter, setFilter] = useState('all');

  // --- 1. MOCK DATA ENHANCEMENT ---
  const rows = useMemo(
    () => [
      {
        id: 1,
        paymentId: 'PAY-8821',
        transactionId: 'TXN_RR_9901',
        userName: 'John Doe',
        amount: 500,
        paymentDate: '2023-06-15',
        status: 'Completed',
        method: 'Razorpay',
        fees: 2.5
      },
      {
        id: 2,
        paymentId: 'PAY-8822',
        transactionId: 'TXN_ST_4402',
        userName: 'Jane Smith',
        amount: 300,
        paymentDate: '2023-06-17',
        status: 'Pending',
        method: 'Stripe',
        fees: 5.0
      },
      {
        id: 3,
        paymentId: 'PAY-8823',
        transactionId: 'TXN_PY_1103',
        userName: 'David Johnson',
        amount: 1200,
        paymentDate: '2023-06-18',
        status: 'Failed',
        method: 'PayPal',
        fees: 12.4
      },
      {
        id: 4,
        paymentId: 'PAY-8824',
        transactionId: 'TXN_UP_3304',
        userName: 'Sarah Connor',
        amount: 450,
        paymentDate: '2023-06-20',
        status: 'Completed',
        method: 'UPI',
        fees: 0.0
      }
    ],
    []
  );

  // --- 2. EXPORT LOGIC ---
  const handleExport = (type) => {
    if (type === 'pdf') {
      const doc = new jsPDF();
      doc.text('Financial Transaction Report', 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['ID', 'Customer', 'Amount', 'Method', 'Status']],
        body: rows.map((r) => [r.paymentId, r.userName, `₹${r.amount}`, r.method, r.status]),
        theme: 'striped',
        headStyles: { fillColor: [67, 24, 255] }
      });
      doc.save('Revenue_Report.pdf');
    } else {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      XLSX.writeFile(wb, 'Billing_Data.xlsx');
    }
  };

  // --- 3. CHART CONFIG (Modern Area Gradient) ---
  const lineChartData = {
    series: [{ name: 'Net Revenue', data: [31, 40, 28, 51, 42, 109, 100] }],
    options: {
      chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
      colors: [COLORS.primary],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      tooltip: { theme: 'light', x: { show: false } }
    }
  };

  const pieChartData = {
    series: [44, 55, 13, 33],
    options: {
      labels: ['Razorpay', 'Stripe', 'PayPal', 'UPI'],
      colors: [COLORS.primary, COLORS.success, COLORS.warning, COLORS.error],
      legend: { position: 'bottom', fontWeight: 600 },
      plotOptions: { pie: { donut: { size: '70%' } } }
    }
  };

  // --- 4. COLUMN DEFINITIONS ---
  const columns = [
    {
      field: 'paymentId',
      headerName: 'REFERENCE',
      width: 120,
      renderCell: (p) => (
        <Typography variant="caption" fontWeight={700} color="primary">
          {p.value}
        </Typography>
      )
    },
    {
      field: 'userName',
      headerName: 'CUSTOMER',
      flex: 1,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: alpha(COLORS.primary, 0.1), color: COLORS.primary, fontWeight: 700, fontSize: '0.75rem' }}
          >
            {p.value
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color={COLORS.textMain}>
              {p.value}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {p.row.transactionId}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      width: 130,
      renderCell: (p) => (
        <Typography variant="body2" fontWeight={800} color={COLORS.textMain}>
          ₹{p.value.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'method',
      headerName: 'GATEWAY',
      width: 130,
      renderCell: (p) => (
        <Chip
          icon={<CardIcon sx={{ fontSize: '14px !important' }} />}
          label={p.value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, border: '1px dashed #E0E5F2' }}
        />
      )
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 130,
      renderCell: (p) => {
        const isSuccess = p.value === 'Completed';
        const isPending = p.value === 'Pending';
        const color = isSuccess ? COLORS.success : isPending ? COLORS.warning : COLORS.error;
        return (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: alpha(color, 0.1), px: 1.5, py: 0.5, borderRadius: 2 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" fontWeight={800} sx={{ color }}>
              {p.value.toUpperCase()}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'OPS',
      width: 100,
      sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Receipt">
            <IconButton size="small">
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Record">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      {/* HEADER SECTION */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} color={COLORS.textMain}>
            Financial Console
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Real-time revenue tracking and gateway audits
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<ExportIcon />}
            variant="contained"
            onClick={() => handleExport('pdf')}
            sx={{ borderRadius: 3, bgcolor: COLORS.primary, boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)' }}
          >
            Export PDF
          </Button>
          <Button
            startIcon={<BankIcon />}
            variant="outlined"
            onClick={() => handleExport('excel')}
            sx={{ borderRadius: 3, borderColor: '#E0E5F2', color: COLORS.textMain }}
          >
            Spreadsheet
          </Button>
        </Stack>
      </Stack>

      {/* KPI GRID */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'GROSS VOLUME', val: '₹1,50,000', icon: <WalletIcon />, col: COLORS.primary, trend: '+12.5%' },
          { label: 'PENDING ESCROW', val: '₹5,000', icon: <InvoiceIcon />, col: COLORS.warning, trend: '4 Invoices' },
          { label: 'FAILED ATTEMPTS', val: '₹2,000', icon: <WarningIcon />, col: COLORS.error, trend: '-2% from prev' }
        ].map((k, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card sx={{ borderRadius: 5, border: 'none', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: alpha(k.col, 0.1), color: k.col, width: 56, height: 56, mr: 2, borderRadius: 4 }}>{k.icon}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">
                    {k.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color={COLORS.textMain}>
                    {k.val}
                  </Typography>
                </Box>
                <Chip label={k.trend} size="small" sx={{ bgcolor: alpha(k.col, 0.05), color: k.col, fontWeight: 900, fontSize: 10 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: 'none', border: '1px solid #E9EDF7' }}>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={800} color={COLORS.textMain}>
                Revenue Trajectory
              </Typography>
              <ProfitIcon color="primary" />
            </Stack>
            <ReactApexChart options={lineChartData.options} series={lineChartData.series} type="area" height={320} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: 'none', border: '1px solid #E9EDF7' }}>
            <Typography variant="h6" fontWeight={800} mb={3} color={COLORS.textMain}>
              Channel Distribution
            </Typography>
            <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="donut" height={320} />
          </Paper>
        </Grid>
      </Grid>

      {/* ENHANCED DATA GRID */}
      <Paper sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0px 20px 40px rgba(112, 144, 176, 0.08)', border: 'none' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
          <Typography variant="h6" fontWeight={800} color={COLORS.textMain}>
            Settlement Ledger
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>
              <FilterIcon sx={{ fontSize: 16, mr: 1 }} /> Status
            </InputLabel>
            <Select value={filter} label="Status" onChange={(e) => setFilter(e.target.value)} sx={{ borderRadius: 3 }}>
              <MenuItem value="all">All Channels</MenuItem>
              <MenuItem value="completed">Success Only</MenuItem>
              <MenuItem value="failed">Flagged/Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          sx={{
            border: 'none',
            px: 2,
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F4F7FE', borderRadius: 2, border: 'none' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
            '& .MuiDataGrid-footerContainer': { border: 'none' }
          }}
        />
      </Paper>
    </Box>
  );
};

export default BillingDashboard;
