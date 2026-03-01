import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllPromotions, createPromotion, updatePromotion, deletePromotion, getPromotionAnalytics } from '../../redux/features/Promotions/PromotionSlice';

const PromotionsDashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    image: null
  });

  const { promotions: storePromotions, isPromotionLoading, isPromotionError, message } = useSelector((state) => state.promotion);

  useEffect(() => {
    if (storePromotions.length === 0) {
      dispatch(fetchAllPromotions());
    } else {
      setPromotions(storePromotions);
    }
  }, [storePromotions, dispatch]);

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataWithImage = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData[key]) {
          formDataWithImage.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataWithImage.append(key, formData[key]);
        }
      });

      const response = await dispatch(createPromotion(formDataWithImage));
      if (response.payload) {
        toast.success('Promotion created successfully');
        setFormData({
          title: '',
          description: '',
          discountType: 'percentage',
          discountValue: 0,
          minPurchase: 0,
          startDate: '',
          endDate: '',
          isActive: true,
          image: null
        });
      }
    } catch (error) {
      toast.error('Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataWithImage = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData[key]) {
          formDataWithImage.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataWithImage.append(key, formData[key]);
        }
      });

      const response = await dispatch(updatePromotion({ id: selectedPromotion._id, data: formDataWithImage }));
      if (response.payload) {
        toast.success('Promotion updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setLoading(true);
      try {
        await dispatch(deletePromotion(id));
        toast.success('Promotion deleted successfully');
      } catch (error) {
        toast.error('Failed to delete promotion');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGetAnalytics = async (id) => {
    setLoading(true);
    try {
      const response = await dispatch(getPromotionAnalytics(id));
      if (response.payload) {
        toast.success('Analytics retrieved successfully');
        console.log('Promotion Analytics:', response.payload.analytics);
      }
    } catch (error) {
      toast.error('Failed to get analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      minPurchase: promotion.minPurchase,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isActive: promotion.isActive,
      image: null
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4">Promotions Management</h1>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">All Promotions</h5>
            </div>
            <div className="card-body">
              {isPromotionLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : isPromotionError ? (
                <div className="alert alert-danger">Error loading promotions</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Discount</th>
                        <th>Validity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.map((promotion) => (
                        <tr key={promotion._id}>
                          <td>{promotion.title}</td>
                          <td>{promotion.description}</td>
                          <td>
                            {promotion.discountType === 'percentage'
                              ? `${promotion.discountValue}% off`
                              : `₹${promotion.discountValue} off`}
                          </td>
                          <td>
                            {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                            {new Date(promotion.endDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={`badge bg-${promotion.isActive ? 'success' : 'danger'}`}>
                              {promotion.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditPromotion(promotion)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger me-2"
                              onClick={() => handleDeletePromotion(promotion._id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleGetAnalytics(promotion._id)}
                            >
                              Analytics
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
              <h5 className="card-title">
                {selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={selectedPromotion ? handleUpdatePromotion : handleCreatePromotion}>
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Discount Type</label>
                    <select
                      className="form-select"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Minimum Purchase Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <small className="text-muted">Image selected: {formData.image.name}</small>
                    </div>
                  )}
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
                  {loading ? 'Processing...' : selectedPromotion ? 'Update Promotion' : 'Create Promotion'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsDashboard;