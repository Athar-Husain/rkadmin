import { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const StaffTable = ({ staffList = [], onSelect }) => {
  console.log('staffList', staffList);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // ===============================
  // Filtered Staff (always array)
  // ===============================
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

  // ===============================
  // Table Rows
  // ===============================
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

  // ===============================
  // Columns (stable)
  // ===============================
  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'username', headerName: 'Username', width: 180 },
      { field: 'role', headerName: 'Role', width: 120 },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'error'} size="small" />
      },
      { field: 'lastLogin', headerName: 'Last Login', width: 180 }
    ],
    []
  );

  // ===============================
  // Render
  // ===============================
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
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        onRowClick={(params) => onSelect?.(params.id)}
      />
    </>
  );
};

export default StaffTable;
