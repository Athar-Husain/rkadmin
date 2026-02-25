import { Chip, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateStaff } from '../../features/staff/StaffSlice';
import Chart from 'react-apexcharts';

export const getStaffPerformance = (staffList) => {
  const now = Date.now();

  return staffList.map((s) => ({
    id: s._id,
    name: s.name,
    daysSinceLogin: s.lastLogin ? Math.floor((now - new Date(s.lastLogin)) / 86400000) : null,
    tenureDays: Math.floor((now - new Date(s.createdAt)) / 86400000)
  }));
};

export const LoginStatusBadge = ({ lastLogin }) => {
  if (!lastLogin) return <Chip label="Never" color="default" />;

  const days = (Date.now() - new Date(lastLogin)) / 86400000;

  if (days < 1) return <Chip label="Today" color="success" />;
  if (days < 7) return <Chip label="This Week" color="warning" />;
  return <Chip label="Inactive" color="error" />;
};

export const StatusToggle = ({ staff }) => {
  const dispatch = useDispatch();

  return (
    <Switch
      checked={staff.isActive}
      onChange={() =>
        dispatch(
          updateStaff({
            id: staff._id,
            data: { isActive: !staff.isActive }
          })
        )
      }
    />
  );
};

export const StaffStatusChart = ({ active, inactive }) => {
  return (
    <Chart
      type="donut"
      height={280}
      series={[active, inactive]}
      options={{
        labels: ['Active', 'Inactive'],
        colors: ['#4caf50', '#f44336'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true }
      }}
    />
  );
};
