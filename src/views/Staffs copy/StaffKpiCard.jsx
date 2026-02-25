import { Card, CardContent, Typography } from '@mui/material';

const StaffKpiCard = ({ title, value }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StaffKpiCard;
