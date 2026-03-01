import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchBanners = async () => {
    const res = await axios.get('/api/admin/banners', {
      params: { page, limit, search, status },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setBanners(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchBanners();
  }, [page, search, status]);

  const toggleActive = async (id, isActive) => {
    await axios.put(`/api/admin/banners/${id}`, { isActive: !isActive });
    fetchBanners();
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this banner?')) return;
    await axios.delete(`/api/admin/banners/${id}`);
    fetchBanners();
  };

  return (
    <div>
      <h2>Banner Management</h2>

      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Active</th>
            <th>Display Order</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr key={b._id}>
              <td>{b.title}</td>
              <td>{b.isActive ? 'Yes' : 'No'}</td>
              <td>{b.displayOrder}</td>
              <td>{b.impressions}</td>
              <td>{b.clicks}</td>
              <td>
                <button onClick={() => toggleActive(b._id, b.isActive)}>{b.isActive ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => deleteBanner(b._id)}>Delete</button>
                <button onClick={() => alert(JSON.stringify(b, null, 2))}>View/Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {' '}
          Page {page} / {Math.ceil(total / limit)}{' '}
        </span>
        <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminBanners;
