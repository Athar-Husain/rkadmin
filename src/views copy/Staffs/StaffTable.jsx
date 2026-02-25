import { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';

const StaffTable = ({ staffList = [], onSelect, isLoading = false }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staffList)) return [];
    return staffList.filter((s) => {
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'ACTIVE' && !s.isActive) return false;
        if (statusFilter === 'INACTIVE' && s.isActive) return false;
      }
      if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
      return true;
    });
  }, [staffList, statusFilter, roleFilter]);

  const rows = useMemo(
    () =>
      filteredStaff.map((s) => ({
        id: s._id,
        name: s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || '—',
        username: s.username || s.email || '—',
        role: s.role || '—',
        status: s.isActive ? 'Active' : 'Inactive',
        lastLogin: s.lastLogin ? new Date(s.lastLogin).toLocaleString() : 'Never'
      })),
    [filteredStaff]
  );

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'username', headerName: 'Username', flex: 1 },
      { field: 'role', headerName: 'Role', width: 120 },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'error'} size="small" />
      },
      { field: 'lastLogin', headerName: 'Last Login', flex: 1 }
    ],
    []
  );

  if (isLoading) {
    return (
      <Box>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <>
      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        onRowClick={(params) => onSelect?.(params.id)}
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            cursor: 'pointer'
          }
        }}
      />
    </>
  );
};

export default StaffTable;
