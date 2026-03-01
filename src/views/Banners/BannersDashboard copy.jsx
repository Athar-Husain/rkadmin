import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllBanners, createBanner, updateBanner, deleteBanner, fetchActiveBanners } from '../../redux/features/Banners/BannerSlice';

const BannersDashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    displayOrder: 0,
    isActive: true,
    type: 'image'
  });

  const { banners: storeBanners, isBannerLoading, isBannerError, message } = useSelector((state) => state.banner);

  useEffect(() => {
    if (storeBanners?.length === 0) {
      dispatch(fetchAllBanners());
    } else {
      setBanners(storeBanners);
    }
  }, [storeBanners, dispatch]);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(createBanner(formData));
      if (response.payload) {
        toast.success('Banner created successfully');
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          targetUrl: '',
          displayOrder: 0,
          isActive: true,
          type: 'image'
        });
      }
    } catch (error) {
      toast.error('Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(updateBanner({ id: selectedBanner._id, data: formData }));
      if (response.payload) {
        toast.success('Banner updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setLoading(true);
      try {
        await dispatch(deleteBanner(id));
        toast.success('Banner deleted successfully');
      } catch (error) {
        toast.error('Failed to delete banner');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFetchActiveBanners = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchActiveBanners());
      if (response.payload) {
        toast.success('Active banners retrieved successfully');
        console.log('Active Banners:', response.payload.banners);
      }
    } catch (error) {
      toast.error('Failed to get active banners');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      type: banner.type
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/banners/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Failed to upload image');
        }
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4">Banner Management</h1>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">All Banners</h5>
            </div>
            <div className="card-body">
              {isBannerLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : isBannerError ? (
                <div className="alert alert-danger">Error loading banners</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Target URL</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banners?.map((banner) => (
                        <tr key={banner._id}>
                          <td>{banner.title}</td>
                          <td>{banner.description}</td>
                          <td>
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} style={{ width: '50px', height: '30px', objectFit: 'cover' }} />
                            ) : (
                              'No Image'
                            )}
                          </td>
                          <td>{banner.targetUrl || 'N/A'}</td>
                          <td>{banner.displayOrder}</td>
                          <td>
                            <span className={`badge bg-${banner.isActive ? 'success' : 'danger'}`}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditBanner(banner)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteBanner(banner._id)}>
                              Delete
                            </button>
                            <button className="btn btn-sm btn-outline-info" onClick={handleFetchActiveBanners}>
                              Active Banners
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">{selectedBanner ? 'Edit Banner' : 'Create New Banner'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={selectedBanner ? handleUpdateBanner : handleCreateBanner}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '5px' }} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Target URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label">Active</label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : selectedBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannersDashboard;
