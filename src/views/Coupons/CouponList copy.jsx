import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Tooltip, Box, CircularProgress, Typography, alpha, LinearProgress, useTheme } from '@mui/material';
import { EditOutlined, HistoryOutlined, ConfirmationNumberOutlined as CouponIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCouponsAdmin } from '../../redux/features/Coupons/CouponSlice';

const CouponList = ({ onEdit, onViewHistory }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { coupons = [], isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(fetchAllCouponsAdmin());
  }, [dispatch]);

  const safeRows = Array.isArray(coupons) ? coupons.filter(Boolean) : [];

  const columns = [
    {
      field: 'code',
      headerName: 'Coupon Code',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CouponIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1 }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'title',
      headerName: 'Campaign Title',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isActive = params.value === 'ACTIVE';
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              bgcolor: isActive ? alpha('#10B981', 0.1) : alpha('#64748B', 0.1),
              color: isActive ? '#059669' : '#475569',
              borderRadius: '6px',
              border: 'none'
            }}
          />
        );
      }
    },
    {
      field: 'usage',
      headerName: 'Redemption Flow',
      width: 220,
      renderCell: (params) => {
        const current = params.row.currentRedemptions || 0;
        const max = params.row.maxRedemptions || 0;
        const progress = max > 0 ? Math.min((current / max) * 100, 100) : 0;
        const isCritical = progress > 85;

        return (
          <Box sx={{ width: '100%', pr: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: isCritical ? 'error.main' : 'text.primary' }}>
                {current}{' '}
                <Typography variant="caption" color="text.disabled">
                  / {max}
                </Typography>
              </Typography>
              <Typography variant="caption" fontWeight={800} color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#E2E8F0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: isCritical ? '#EF4444' : '#6366F1',
                  backgroundImage:
                    'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)'
                }
              }}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Management',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Coupon">
            <IconButton
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{ mr: 1, color: 'primary.main', bgcolor: alpha('#6366F1', 0.05), '&:hover': { bgcolor: alpha('#6366F1', 0.1) } }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Redemption History">
            <IconButton
              size="small"
              onClick={() => onViewHistory(params.row)}
              sx={{ color: 'text.secondary', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#F1F5F9' } }}
            >
              <HistoryOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (isCouponLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 2 }}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Loading your campaigns...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <DataGrid
        rows={safeRows}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25]}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            fontWeight: 800,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: 'text.secondary'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: alpha('#6366F1', 0.02)
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0'
          }
        }}
      />
    </Box>
  );
};

// Simple Stack component if not imported from MUI
const Stack = ({ children, direction = 'row', justifyContent, sx }) => (
  <Box sx={{ display: 'flex', flexDirection: direction, justifyContent, ...sx }}>{children}</Box>
);

export default CouponList;
