import { DataGrid } from '@mui/x-data-grid';
import { PurchaseStatusChip } from './PurchaseHelper';

const PurchaseTable = ({ purchases = [], onView }) => {
  const columns = [
    {
      field: 'sl',
      headerName: 'Sl No',
      width: 90
    },
    {
      field: 'user',
      headerName: 'User',
      width: 180
    },
    {
      field: 'store',
      headerName: 'Store',
      width: 220
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <PurchaseStatusChip status={params.value} />
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 160
    }
  ];

  const rows = purchases.map((p, index) => ({
    id: p._id, // REQUIRED by DataGrid
    sl: index + 1,
    user: p.userId?.name || 'Guest',
    store: p.storeId?.name || '-',
    amount: p.formattedFinalAmount || `₹${p.finalAmount}`,
    status: p.status,
    date: new Date(p.createdAt).toLocaleDateString()
  }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      onRowClick={(params) => onView?.(params.row.id)}
    />
  );
};

export default PurchaseTable;
