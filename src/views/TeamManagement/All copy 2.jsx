import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  Avatar,
  Chip,
  alpha,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  VisibilityOutlined as VisibilityIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  PersonAddAlt1Rounded as AddIcon,
  BadgeOutlined as BadgeIcon,
  EventNoteOutlined as DateIcon,
  PeopleAltRounded as PeopleIcon,
  MapRounded as MapIcon,
  AssignmentIndRounded as RoleIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeamMembers, deleteTeamMember } from '../../redux/features/Team/TeamSlice';
import TeamEditModal from './TeamEditModal';
import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';

const All = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { teamMembers = [], isTeamLoading, isTeamError } = useSelector((state) => state.team);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllTeamMembers());
  }, [dispatch]);

  // KPI Logic
  const totalTechnicians = teamMembers.filter((m) => m.role?.toLowerCase() === 'technician').length;
  const uniqueRegions = [...new Set(teamMembers.flatMap((m) => m.area?.map((a) => a.region) || []))].length;

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await dispatch(deleteTeamMember(memberToDelete)).unwrap();
        toast.success('Member removed successfully');
        dispatch(getAllTeamMembers());
      } catch (err) {
        toast.error('Deletion failed');
      } finally {
        setConfirmModalOpen(false);
        setMemberToDelete(null);
      }
    }
  };

  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        boxShadow: '0px 12px 30px rgba(112, 144, 176, 0.06)',
        border: '1px solid #F4F7FE'
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 56,
          height: 56,
          mr: 2
        }}
      >
        {icon}
      </Avatar>
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

  // const columns = [
  //   {
  //     field: 'fullName',
  //     headerName: 'TEAM MEMBER',
  //     flex: 1.5,
  //     renderCell: (params) => (
  //       <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
  //         <Avatar
  //           sx={{
  //             width: 40,
  //             height: 40,
  //             fontSize: '0.85rem',
  //             fontWeight: 800,
  //             bgcolor: alpha(theme.palette.primary.main, 0.1),
  //             color: theme.palette.primary.main
  //           }}
  //         >
  //           {params.row.firstName?.charAt(0).toUpperCase()}
  //           {params.row.lastName?.charAt(0).toUpperCase()}
  //         </Avatar>
  //         <Box>
  //           <Typography variant="body2" fontWeight={700} color="#1B2559">
  //             {params.row.firstName} {params.row.lastName}
  //           </Typography>
  //           <Typography variant="caption" color="text.secondary">
  //             {params.row.email}
  //           </Typography>
  //         </Box>
  //       </Stack>
  //     )
  //   },
  //   {
  //     field: 'role',
  //     headerName: 'ROLE',
  //     flex: 0.8,
  //     renderCell: (params) => (
  //       <Chip
  //         label={params.value}
  //         size="small"
  //         sx={{ textTransform: 'capitalize', fontWeight: 600, bgcolor: '#F4F7FE', color: '#4318FF' }}
  //       />
  //     )
  //   },
  //   {
  //     field: 'area',
  //     headerName: 'ASSIGNMENTS',
  //     flex: 1.2,
  //     renderCell: (params) => (
  //       <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
  //         {params.value?.map((a, i) => (
  //           <Chip key={i} label={a.region} size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
  //         ))}
  //       </Stack>
  //     )
  //   },
  //   {
  //     field: 'actions',
  //     headerName: 'ACTIONS',
  //     width: 140,
  //     headerAlign: 'right',
  //     align: 'right',
  //     renderCell: (params) => (
  //       <Stack direction="row" spacing={1}>
  //         <Tooltip title="View">
  //           <IconButton
  //             size="small"
  //             onClick={() => navigate(`/team/${params.row._id}`)}
  //             sx={{ color: '#4318FF', bgcolor: alpha('#4318FF', 0.05) }}
  //           >
  //             <VisibilityIcon fontSize="small" />
  //           </IconButton>
  //         </Tooltip>
  //         <Tooltip title="Edit">
  //           <IconButton
  //             size="small"
  //             onClick={() => {
  //               setSelectedMember(params.row);
  //               setEditModalOpen(true);
  //             }}
  //             sx={{ color: '#01B574', bgcolor: alpha('#01B574', 0.05) }}
  //           >
  //             <EditIcon fontSize="small" />
  //           </IconButton>
  //         </Tooltip>
  //         <Tooltip title="Delete">
  //           <IconButton
  //             size="small"
  //             onClick={() => {
  //               setMemberToDelete(params.row._id);
  //               setConfirmModalOpen(true);
  //             }}
  //             sx={{ color: '#EE5D50', bgcolor: alpha('#EE5D50', 0.05) }}
  //           >
  //             <DeleteIcon fontSize="small" />
  //           </IconButton>
  //         </Tooltip>
  //       </Stack>
  //     )
  //   }
  // ];

  const columns = [
    {
      field: 'fullName',
      headerName: 'TEAM MEMBER',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: '0.85rem',
              fontWeight: 800,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1.5px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            {params.row.firstName?.charAt(0).toUpperCase()}
            {params.row.lastName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#1B2559">
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'role',
      headerName: 'ROLE',
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          size="small"
          icon={<BadgeIcon style={{ fontSize: '14px', color: 'inherit' }} />}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            bgcolor: '#F4F7FE',
            color: '#4318FF',
            border: 'none'
          }}
        />
      )
    },
    {
      field: 'area',
      headerName: 'ASSIGNED REGIONS',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', py: 1 }}>
          {params.value && params.value.length > 0 ? (
            params.value.map((a, i) => (
              <Chip
                key={i}
                label={a.region}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: '20px', borderColor: '#E9EDF7', fontWeight: 700 }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.disabled">
              No Regions
            </Typography>
          )}
        </Stack>
      )
    },
    {
      field: 'createdAt',
      headerName: 'JOINED DATE',
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <DateIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="caption" fontWeight={500} color="text.secondary">
            {new Date(params.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 140,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Profile">
            <IconButton size="small" onClick={() => handleViewOpen(params.row)} sx={{ color: '#4318FF', bgcolor: alpha('#4318FF', 0.05) }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEditOpen(params.row)} sx={{ color: '#01B574', bgcolor: alpha('#01B574', 0.05) }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row._id)}
              sx={{ color: '#EE5D50', bgcolor: alpha('#EE5D50', 0.05) }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* 1. Header Section */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559', letterSpacing: '-0.02em' }}>
            Team Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Operational overview of all system personnel
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/team/create')}
          sx={{
            bgcolor: '#4318FF',
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
            '&:hover': { bgcolor: '#3311CC' }
          }}
        >
          Add New Member
        </Button>
      </Stack>

      {/* 2. KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Total Roster" value={teamMembers.length} icon={<PeopleIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Field Technicians" value={totalTechnicians} icon={<RoleIcon />} color="#01B574" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Active Regions" value={uniqueRegions} icon={<MapIcon />} color="#FFB547" />
        </Grid>
      </Grid>

      {/* 3. Main Data Table */}
      {isTeamError ? (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          Error loading data
        </Alert>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, bgcolor: '#fff', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)' }}>
          <DataGrid
            rows={teamMembers.map((m) => ({ ...m, id: m._id }))}
            columns={columns}
            loading={isTeamLoading}
            autoHeight
            disableRowSelectionOnClick
            rowHeight={70}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid #F4F7FE',
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 800, color: 'text.disabled', fontSize: '0.75rem' }
              },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
              '& .MuiDataGrid-row:hover': { bgcolor: alpha('#F4F7FE', 0.5) }
            }}
          />
        </Paper>
      )}

      <TeamEditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} member={selectedMember} />
      <ConfirmDialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="This action will permanently remove this member from the database."
      />
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default All;
