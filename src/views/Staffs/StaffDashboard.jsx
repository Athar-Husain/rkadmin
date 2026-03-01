import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Button, Skeleton, Stack, alpha, useTheme, Paper } from '@mui/material';
import { PersonAddRounded as PersonAddIcon, DashboardCustomizeTwoTone as DashboardIcon } from '@mui/icons-material';

import { getAllStaff } from '../../redux/features/Staff/StaffSlice';
import StaffStatusChart from './StaffStatusChart';
import StaffTable from './StaffTable.jsx';
import { calculateStaffStats } from './staffStats';
import StaffKpiCard from './StaffKpiCard';
import StaffFormModal from './StaffFormModal';

const StaffDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { staffList, isStaffLoading } = useSelector((state) => state.staff);

  const [openForm, setOpenForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);

  // Memoize stats to prevent unnecessary recalculations
  const stats = useMemo(() => calculateStaffStats(staffList), [staffList]);

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setOpenForm(true);
  };

  const handleEditStaff = (staffId) => {
    const staff = staffList.find((s) => s._id === staffId);
    setSelectedStaff(staff);
    setOpenForm(true);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: '100vh',
        bgcolor: '#F8FAFC', // Professional off-white
        background: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%)`
      }}
    >
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 5 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <DashboardIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#0F172A', letterSpacing: '-0.02em' }}>
              Staff Operations
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Manage your workforce performance and administrative permissions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          disableElevation
          startIcon={<PersonAddIcon />}
          onClick={handleAddStaff}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}
        >
          Add New Member
        </Button>
      </Stack>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {isStaffLoading
          ? Array.from(new Array(4)).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                <Skeleton variant="rectangular" height={110} sx={{ borderRadius: '20px' }} />
              </Grid>
            ))
          : [
              { title: 'Total Staff', value: stats.total, color: theme.palette.primary.main },
              { title: 'Active Members', value: stats.active, color: '#10B981' },
              { title: 'Currently Inactive', value: stats.inactive, color: '#64748B' },
              { title: 'New Onboarded', value: stats.newStaff, color: '#F59E0B' }
            ].map((card) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
                <StaffKpiCard title={card.title} value={card.value} color={card.color} />
              </Grid>
            ))}
      </Grid>

      {/* Analytics & Table Section */}
      <Grid container spacing={4}>
        {/* Chart Card */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3, color: '#1E293B' }}>
              Distribution Overview
            </Typography>
            {isStaffLoading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '16px' }} />
            ) : (
              <StaffStatusChart active={stats.active} inactive={stats.inactive} />
            )}
          </Paper>
        </Grid>

        {/* Table Card */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              bgcolor: 'white'
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid #F1F5F9' }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#1E293B' }}>
                All Staff Directory
              </Typography>
            </Box>
            <StaffTable staffList={staffList} onSelect={handleEditStaff} isLoading={isStaffLoading} />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal Integration */}
      {openForm && <StaffFormModal open={openForm} handleClose={() => setOpenForm(false)} staff={selectedStaff} />}
    </Box>
  );
};

export default StaffDashboard;
