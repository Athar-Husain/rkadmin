import { DataGrid } from '@mui/x-data-grid';
import { PurchaseStatusChip } from './PurchaseHelper';

const PurchaseTable = ({ purchases = [], onView }) => {
  const columns = [
    { field: 'sl', headerName: 'SL', width: 70 }, // Serial number
    { field: 'invoice', headerName: 'Invoice No', width: 130 },
    { field: 'store', headerName: 'Store', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 130 },
    { field: 'status', headerName: 'Order Status', width: 150, renderCell: (params) => <PurchaseStatusChip status={params.value} /> },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 150 },
    { field: 'deliveryType', headerName: 'Delivery Type', width: 150 },
    { field: 'deliveryStatus', headerName: 'Delivery Status', width: 150 },
    { field: 'date', headerName: 'Date', width: 140 }
  ];

  const rows = purchases.map((p, index) => ({
    id: p._id, // required by DataGrid
    sl: index + 1,
    invoice: p.invoiceNumber,
    store: p.storeId?.name || '-',
    amount: p.formattedFinalAmount || `₹${p.finalAmount}`,
    status: p.status,
    paymentMethod: p.payment?.method || '-',
    paymentStatus: p.payment?.status || '-',
    deliveryType: p.delivery?.type || '-',
    deliveryStatus: p.delivery?.status || '-',
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
