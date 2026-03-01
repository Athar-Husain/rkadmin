import { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Avatar, Typography, Stack, alpha } from '@mui/material';

const StaffTable = ({ staffList = [], onSelect, isLoading = false }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const rows = useMemo(
    () =>
      staffList.map((s) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        isActive: s.isActive,
        lastLogin: s.lastLogin
      })),
    [staffList]
  );

  const columns = [
    // {
    //   field: 'name',
    //   headerName: 'Team Member',
    //   flex: 1.5,
    //   renderCell: (params) => (
    //     <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
    //       <Avatar sx={{ bgcolor: alpha('#2563EB', 0.1), color: '#2563EB', fontWeight: 700, fontSize: '0.8rem' }}>
    //         {params.value
    //           ?.split(' ')
    //           .map((n) => n[0])
    //           .join('')}
    //       </Avatar>
    //       <Box>
    //         <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B' }}>
    //           {params.value}
    //         </Typography>
    //         <Typography variant="caption" color="text.secondary">
    //           {params.row.email}
    //         </Typography>
    //       </Box>
    //     </Stack>
    //   )
    // },
    {
      field: 'name',
      headerName: 'Team Member',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        const initials = params.value
          ?.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%', py: 1 }}>
            <Avatar
              sx={{
                bgcolor: alpha('#2563EB', 0.1),
                color: '#2563EB',
                width: 40,
                height: 40,
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {params.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {params.row.email || 'No Email'}
              </Typography>
            </Box>
          </Stack>
        );
      }
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: params.value ? '#10B981' : '#CBD5E1' }} />
          <Typography variant="body2" fontWeight={600} color={params.value ? '#10B981' : '#64748B'}>
            {params.value ? 'Active' : 'Offline'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'lastLogin',
      headerName: 'Last Session',
      flex: 1,
      valueFormatter: (params) => (params ? new Date(params).toLocaleDateString() : '—')
    }
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        onRowClick={(params) => onSelect?.(params.id)}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#F8FAFC',
            color: '#64748B',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.7rem'
          },
          '& .MuiDataGrid-cell:focus': { outline: 'none' }
        }}
      />
    </Box>
  );
};

export default StaffTable;
