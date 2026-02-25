import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllPurchases } from '../../features/purchase/PurchaseSlice';
// import { formatCurrency } from '../../utils/formatCurrency';
// import { selectAllPurchases } from '../../features/purchase/purchaseSelectors';
// import PurchaseStatusBadge from './PurchaseHelper.jsx';
import { formatCurrency } from '../../utils/common';
import { getAllPurchases } from '../../redux/features/Purchases/PurchaseSlice';
import { calculateKPIs, PurchaseStatusBadge } from './PurchaseHelper';

const PurchaseDashboard = () => {
  const dispatch = useDispatch();
  //   const purchases = useSelector(selectAllPurchases);
  const { purchases, isPurchaseLoading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(getAllPurchases());
  }, [dispatch]);

  const stats = calculateKPIs(purchases);

  const KpiCard = ({ title, value }) => (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Purchase Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
        <KpiCard title="Total Orders" value={stats.totalOrders} />
        <KpiCard title="Today's Sales" value={formatCurrency(stats.todaySales)} />
        <KpiCard title="Cancelled / Refunded" value={`${stats.cancelled} / ${stats.refunded}`} />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button onClick={() => (window.location.href = '/admin/purchases/export')} className="btn btn-primary">
          Export Excel
        </button>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Store</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.slice(0, 10).map((p) => (
              <tr key={p._id}>
                <td>{p._id.slice(-6)}</td>
                <td>{p.user?.name || 'Guest'}</td>
                <td>{p.store?.name}</td>
                <td>{formatCurrency(p.finalAmount)}</td>
                <td>
                  <PurchaseStatusBadge status={p.status} />
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="text-blue-600" onClick={() => (window.location.href = `/admin/purchases/${p._id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isPurchaseLoading && <div className="p-4 text-center">Loading...</div>}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
