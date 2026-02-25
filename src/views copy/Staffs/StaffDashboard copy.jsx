import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { getAllStaff } from '../../redux/features/Staff/StaffSlice';
import StaffStatusChart from './StaffStatusChart';
import StaffTable from './StaffTable';
import { calculateStaffStats } from './staffStats';
import StaffKpiCard from './StaffKpiCard';
import StaffFormModal from './StaffFormModal';

import { useState } from 'react';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { staffList, isStaffLoading } = useSelector((state) => state.staff);
  const [openForm, setOpenForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);

  const stats = calculateStaffStats(staffList);

  const handleAddStaff = () => {
    setSelectedStaff(null); // create mode
    setOpenForm(true);
  };

  const handleEditStaff = (staffId) => {
    const staff = staffList.find((s) => s._id === staffId);
    setSelectedStaff(staff); // edit mode
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
        <Grid item xs={12} md={3}>
          <StaffKpiCard title="Total Staff" value={stats.total} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StaffKpiCard title="Active Staff" value={stats.active} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StaffKpiCard title="Inactive Staff" value={stats.inactive} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StaffKpiCard title="New (30 days)" value={stats.newStaff} />
        </Grid>
      </Grid>

      {/* Chart + Table */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={1}>
            Staff Status
          </Typography>
          <StaffStatusChart active={stats.active} inactive={stats.inactive} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" mb={1}>
            Staff List
          </Typography>
          <StaffTable staffList={staffList} onSelect={handleEditStaff} />
        </Grid>
      </Grid>

      {isStaffLoading && <Typography mt={2}>Loading staff data...</Typography>}

      {/* Create/Edit Staff Form Modal */}
      {openForm && <StaffFormModal open={openForm} handleClose={() => setOpenForm(false)} staff={selectedStaff} />}
    </Box>
  );
};

export default StaffDashboard;
