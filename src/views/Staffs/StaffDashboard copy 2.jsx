import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Button, Skeleton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { getAllStaff } from '../../redux/features/Staff/StaffSlice';
import StaffStatusChart from './StaffStatusChart';
import StaffTable from './StaffTable.jsx';
import { calculateStaffStats } from './staffStats';
import StaffKpiCard from './StaffKpiCard';
import StaffFormModal from './StaffFormModal';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { staffList, isStaffLoading } = useSelector((state) => state.staff);
  console.log('staffList', staffList);
  const [openForm, setOpenForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);

  const stats = calculateStaffStats(staffList);

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
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Staff Management Dashboard
        </Typography>

        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddStaff}>
          Add Staff
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        {isStaffLoading
          ? [0, 1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={80} />
              </Grid>
            ))
          : [
              { title: 'Total Staff', value: stats.total },
              { title: 'Active Staff', value: stats.active },
              { title: 'Inactive Staff', value: stats.inactive },
              { title: 'New (30 days)', value: stats.newStaff }
            ].map((card) => (
              <Grid size={{ xs: 12, md: 3 }} key={card.title}>
                <StaffKpiCard title={card.title} value={card.value} />
              </Grid>
            ))}
      </Grid>

      {/* Chart + Table */}
      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" mb={1}>
            Staff Status
          </Typography>
          {isStaffLoading ? (
            <Skeleton variant="rectangular" height={280} />
          ) : (
            <StaffStatusChart active={stats.active} inactive={stats.inactive} />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" mb={1}>
            Staff List
          </Typography>
          <StaffTable staffList={staffList} onSelect={handleEditStaff} isLoading={isStaffLoading} />
        </Grid>
      </Grid>

      {/* Create/Edit Staff Form Modal */}
      {openForm && <StaffFormModal open={openForm} handleClose={() => setOpenForm(false)} staff={selectedStaff} />}
    </Box>
  );
};

export default StaffDashboard;
