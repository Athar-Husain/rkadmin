import { Card, CardContent, Typography } from '@mui/material';

import { Chip } from '@mui/material';

export const KpiCard = ({ title, value }) => {
  return (
    <Card elevation={3}>
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

// export default KpiCard;

const statusColor = {
  CREATED: 'default',
  PAID: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'warning'
};

export const PurchaseStatusChip = ({ status }) => {
  return <Chip label={status} color={statusColor[status] || 'default'} size="small" />;
};

export const calculatePurchaseStats = (purchases) => {
  const today = new Date().toDateString();

  return purchases.reduce(
    (acc, p) => {
      acc.totalRevenue += p.finalAmount || 0;
      acc.totalOrders += 1;

      if (new Date(p.createdAt).toDateString() === today) {
        acc.todaySales += p.finalAmount || 0;
      }

      if (p.status === 'CANCELLED') acc.cancelled += 1;
      if (p.status === 'REFUNDED') acc.refunded += 1;

      return acc;
    },
    {
      totalRevenue: 0,
      totalOrders: 0,
      todaySales: 0,
      cancelled: 0,
      refunded: 0
    }
  );
};


