import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

const StaffTable = ({ staffList, onSelect }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'role', headerName: 'Role', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'error'} size="small" />
    },
    { field: 'createdAt', headerName: 'Created', width: 160 }
  ];

  const rows = staffList.map((s) => ({
    id: s._id.slice(-6),
    name: s.name,
    email: s.email,
    role: s.role || 'Staff',
    status: s.isActive ? 'Active' : 'Inactive',
    createdAt: new Date(s.createdAt).toLocaleDateString()
  }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      onRowClick={(params) => onSelect(params.id)}
    />
  );
};

export default StaffTable;
