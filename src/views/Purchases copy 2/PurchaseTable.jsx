import { DataGrid } from '@mui/x-data-grid';
import { PurchaseStatusChip } from './PurchaseHelper';

const PurchaseTable = ({ purchases = [], onView }) => {
  const columns = [
    { field: 'sl', headerName: 'SL', width: 70 },
    { field: 'invoice', headerName: 'Invoice No', width: 130 },
    { field: 'store', headerName: 'Store', width: 200 },
    { field: 'user', headerName: 'Customer', width: 180 },
    { field: 'mobile', headerName: 'Mobile', width: 140 },
    { field: 'amount', headerName: 'Amount', width: 130 },
    { field: 'discount', headerName: 'Discount', width: 120 },
    { field: 'subtotal', headerName: 'Subtotal', width: 130 },
    { field: 'tax', headerName: 'Tax', width: 100 },
    {
      field: 'status',
      headerName: 'Order Status',
      width: 150,
      renderCell: (params) => <PurchaseStatusChip status={params.value} />
    },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 150 },
    { field: 'deliveryType', headerName: 'Delivery Type', width: 150 },
    { field: 'deliveryStatus', headerName: 'Delivery Status', width: 150 },
    { field: 'installation', headerName: 'Installation', width: 130 },
    { field: 'itemsCount', headerName: 'Items', width: 90 },
    { field: 'date', headerName: 'Date', width: 140 }
  ];

  const rows = purchases.map((p, index) => ({
    id: p._id,
    sl: index + 1,
    invoice: p.invoiceNumber || '-',
    store: p.storeId?.name || '-',
    user: p.userId?.name || 'Guest',
    mobile: p.userId?.mobile || '-',
    amount: p.formattedFinalAmount || `₹${p.finalAmount}`,
    discount: p.formattedDiscount || `₹${p.discount}`,
    subtotal: p.formattedSubtotal || `₹${p.subtotal}`,
    tax: `₹${p.tax || 0}`,
    status: p.status,
    paymentMethod: p.payment?.method || '-',
    paymentStatus: p.payment?.status || '-',
    deliveryType: p.delivery?.type || '-',
    deliveryStatus: p.delivery?.status || '-',
    installation: p.delivery?.installationRequired ? 'Yes' : 'No',
    itemsCount: p.items?.length || 0,
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
