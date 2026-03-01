import { Card, Box, Typography, alpha, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StaffKpiCard = ({ title, value, color }) => {
  const theme = useTheme();
  const accentColor = color || theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '20px',
        border: '1px solid',
        borderColor: alpha(accentColor, 0.1),
        background: `linear-gradient(135deg, #fff 0%, ${alpha(accentColor, 0.02)} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          {title}
        </Typography>
        <Box display="flex" alignItems="baseline" gap={1}>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#1E293B' }}>
            {value}
          </Typography>
        </Box>
      </Box>

      {/* Subtle Background Graphic */}
      <TrendingUpIcon
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -10,
          fontSize: 80,
          color: alpha(accentColor, 0.05),
          transform: 'rotate(-10deg)'
        }}
      />
    </Card>
  );
};

export default StaffKpiCard;
