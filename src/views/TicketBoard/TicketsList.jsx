import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  Avatar
} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  AddRounded as AddIcon,
  RefreshRounded as RefreshIcon,
  SearchRounded as SearchIcon,
  VisibilityRounded as VisibilityIcon,
  DeleteOutlineRounded as DeleteIcon,
  ConfirmationNumberRounded as TicketIcon,
  HourglassEmptyRounded as PendingIcon,
  CheckCircleRounded as ResolvedIcon,
  EditRounded as EditIcon,
  PersonOutline as PersonIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';

import Breadcrumbs from '../../component/Breadcrumb';
import AddTicket from './AddTicket';
import { getAllTickets, deleteTicket } from '../../redux/features/Tickets/TicketSlice';

/* ===================================================
   🔹 STATUS & PRIORITY CONFIG
=================================================== */
const STATUS_COLORS = {
  open: 'info',
  'in progress': 'warning',
  escalated: 'error',
  resolved: 'success',
  closed: 'success'
};

const PRIORITY_COLORS = {
  high: 'error',
  medium: 'warning',
  low: 'success',
  critical: 'error'
};

const ModernChip = ({ label, variant }) => {
  const theme = useTheme();
  const key = String(label || '').toLowerCase();
  const paletteKey = variant === 'status' ? STATUS_COLORS[key] : PRIORITY_COLORS[key];
  const palette = theme.palette[paletteKey] || theme.palette.grey;

  return (
    <Chip
      size="small"
      label={label || '—'}
      sx={{
        fontWeight: 700,
        fontSize: '0.7rem',
        borderRadius: '6px',
        backgroundColor: alpha(palette.main, 0.1),
        color: palette.main,
        border: `1px solid ${alpha(palette.main, 0.2)}`,
        textTransform: 'capitalize',
        height: 24,
        '& .MuiChip-label': { px: 1.2 }
      }}
    />
  );
};

/* ===================================================
   🔹 STAT CARD
=================================================== */
const StatCard = ({ title, count, icon: Icon, color }) => (
  <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
    <CardContent sx={{ p: '24px !important' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha(color, 0.1), color, display: 'flex' }}>
          <Icon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            {count}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

/* ===================================================
   🔹 MAIN COMPONENT
=================================================== */
const TicketsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { allTickets = [], isLoading } = useSelector((state) => state.ticket);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [openAddTicketDialog, setOpenAddTicketDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  const stats = useMemo(
    () => ({
      total: allTickets.length,
      open: allTickets.filter((t) => t.status === 'Open').length,
      pending: allTickets.filter((t) => t.status === 'In Progress').length,
      resolved: allTickets.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length
    }),
    [allTickets]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        const value = term.toLowerCase();
        setFilteredTickets(
          allTickets.filter((t) => {
            const agentName = `${t.assignedTo?.firstName || ''} ${t.assignedTo?.lastName || ''}`.toLowerCase();
            return (
              t.description?.toLowerCase().includes(value) ||
              t.status?.toLowerCase().includes(value) ||
              agentName.includes(value) ||
              t.issueType?.toLowerCase().includes(value)
            );
          })
        );
      }, 400),
    [allTickets]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const columns = useMemo(
    () => [
      {
        field: 'description',
        headerName: 'Ticket & Issue',
        flex: 2,
        minWidth: 280,
        renderCell: (params) => (
          <Stack justifyContent="center" sx={{ height: '100%', py: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b' }}>
                {params.row.issueType || 'Other'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: '#eff6ff',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                  fontWeight: 700,
                  color: '#2563eb',
                  fontSize: '0.65rem',
                  border: '1px solid #dbeafe'
                }}
              >
                #{params.row._id?.slice(-6).toUpperCase()}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.75rem', maxWidth: 250 }}>
              {params.value || 'No description provided'}
            </Typography>
          </Stack>
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <ModernChip label={params.value} variant="status" />
          </Box>
        )
      },
      {
        field: 'priority',
        headerName: 'Priority',
        width: 120,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <ModernChip label={params.value} variant="priority" />
          </Box>
        )
      },
      {
        field: 'assignedTo',
        headerName: 'Assigned Agent',
        flex: 1,
        minWidth: 220,
        renderCell: (params) => {
          const agent = params.row?.assignedTo;
          const name = agent ? `${agent.firstName} ${agent.lastName}` : 'Unassigned';
          const initials = agent ? `${agent.firstName?.[0] || ''}${agent.lastName?.[0] || ''}` : '';

          return (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  bgcolor: agent ? '#2563eb' : '#f1f5f9',
                  color: agent ? '#fff' : '#94a3b8'
                }}
              >
                {agent ? initials.toUpperCase() : <PersonIcon fontSize="small" />}
              </Avatar>
              <Stack spacing={0} justifyContent="center">
                <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2, color: '#1e293b' }}>
                  {name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}
                >
                  {agent?.role || 'TECHNICIAN'}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        field: 'createdAt',
        headerName: 'Date Created',
        width: 150,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', height: '100%' }}>
            {dayjs(params.value).format('DD MMM YYYY')}
          </Typography>
        )
      },
      {
        field: 'actions',
        headerName: '',
        width: 100,
        sortable: false,
        align: 'right',
        renderCell: (params) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ height: '100%', width: '100%' }}>
            <IconButton
              size="small"
              onClick={() => navigate(`/ticket/${params.row._id}`)}
              sx={{ color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
            >
              <VisibilityIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                if (window.confirm('Delete ticket?')) dispatch(deleteTicket(params.row._id));
              }}
              sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        )
      }
    ],
    [navigate, dispatch]
  );

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* <Breadcrumbs
        title="Support Desk"
        subtitle="Monitor and resolve customer issues globally"
        links={[{ label: 'Home', to: '/' }, { label: 'Tickets' }]}
      /> */}

      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Tickets" count={stats.total} icon={TicketIcon} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Open Requests" count={stats.open} icon={PendingIcon} color="#0ea5e9" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="On-Going" count={stats.pending} icon={EditIcon} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Resolved" count={stats.resolved} icon={ResolvedIcon} color="#10b981" />
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '16px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
          <TextField
            size="small"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f8fafc' } }}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: '#94a3b8' }} /> }}
          />
          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => dispatch(getAllTickets())}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddTicketDialog(true)}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                bgcolor: '#2563eb',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' }
              }}
            >
              New Ticket
            </Button>
          </Stack>
        </Box>

        <DataGrid
          rows={searchTerm ? filteredTickets : allTickets}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          autoHeight
          rowHeight={80}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#f8fafc',
              color: '#475569',
              fontWeight: 800,
              borderBottom: '1px solid #e2e8f0'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: '#fbfcfd'
            }
          }}
        />
      </Paper>

      <AddTicket open={openAddTicketDialog} handleClose={() => setOpenAddTicketDialog(false)} />
    </Box>
  );
};

export default TicketsList;
