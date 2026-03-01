import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  IconButton,
  FormControlLabel
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { fetchAllBanners, createBanner, updateBanner, deleteBanner, fetchActiveBanners } from '../../redux/features/Banners/BannerSlice';

const BannersDashboard = () => {
  const dispatch = useDispatch();
  const { banners, isBannerLoading, isBannerError } = useSelector((state) => state.banner);

  // console.log('banners', banners);
  // console.log('storeBanners', storeBanners);

  const [loading, setLoading] = useState(false);
  // const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const initialFormState = {
    title: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    actionType: 'NONE',
    actionValue: '',
    startDate: '',
    endDate: '',
    displayOrder: 0,
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!banners || banners.length === 0) {
      dispatch(fetchAllBanners());
    }
  }, [dispatch]);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      const response = await dispatch(createBanner(payload));

      if (response.payload) {
        toast.success('Banner created successfully');
        setFormData(initialFormState);
        setSelectedBanner(null);
      }
    } catch (error) {
      toast.error('Failed to create banner');
      toast.info(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      const response = await dispatch(updateBanner({ id: selectedBanner._id, data: payload }));

      if (response.payload) {
        toast.success('Banner updated successfully');
        setSelectedBanner(null);
        setFormData(initialFormState);
      }
    } catch (error) {
      toast.error('Failed to update banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    setLoading(true);
    try {
      await dispatch(deleteBanner(id));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchActiveBanners = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchActiveBanners());
      if (response.payload) {
        toast.success('Active banners retrieved successfully');
        console.log(response.payload);
      }
    } catch (error) {
      toast.error('Failed to fetch active banners');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);

    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      imageAlt: banner.imageAlt || '',
      actionType: banner.actionType || 'NONE',
      actionValue: banner.actionValue || '',
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive ?? true
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch('/api/banners/upload', {
        method: 'POST',
        body: uploadData
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.imageUrl
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      toast.error('Image upload failed');
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Banner Management
      </Typography>

      {/* Banner Table */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="All Banners" />
            <CardContent>
              {isBannerLoading ? (
                <CircularProgress />
              ) : isBannerError ? (
                <Typography color="error">Error loading banners</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Order</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {banners?.map((banner) => (
                        <TableRow key={banner._id}>
                          <TableCell>{banner.title}</TableCell>
                          <TableCell>
                            {banner.imageUrl && (
                              <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                style={{
                                  width: 60,
                                  height: 40,
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{banner.actionType}</TableCell>
                          <TableCell>{new Date(banner.startDate).toLocaleString()}</TableCell>
                          <TableCell>{new Date(banner.endDate).toLocaleString()}</TableCell>
                          <TableCell>{banner.isActive ? 'Active' : 'Inactive'}</TableCell>
                          <TableCell>{banner.displayOrder}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEditBanner(banner)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteBanner(banner._id)}>
                              <Delete />
                            </IconButton>
                            <IconButton onClick={handleFetchActiveBanners}>
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form */}
      <Grid container spacing={3} mt={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title={selectedBanner ? 'Edit Banner' : 'Create Banner'} />
            <CardContent>
              <form onSubmit={selectedBanner ? handleUpdateBanner : handleCreateBanner}>
                <TextField
                  label="Title"
                  fullWidth
                  required
                  margin="normal"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />

                {/* <TextField type="file" fullWidth margin="normal" onChange={handleImageUpload} /> */}

                <TextField
                  label="Image URL"
                  fullWidth
                  required
                  margin="normal"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />

                <TextField
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  required
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value
                    })
                  }
                />

                <TextField
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  required
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value
                    })
                  }
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Action Type</InputLabel>
                  <Select
                    value={formData.actionType}
                    label="Action Type"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionType: e.target.value
                      })
                    }
                  >
                    <MenuItem value="NONE">None</MenuItem>
                    <MenuItem value="URL">URL</MenuItem>
                    <MenuItem value="PRODUCT">Product</MenuItem>
                    <MenuItem value="CATEGORY">Category</MenuItem>
                    <MenuItem value="STORE">Store</MenuItem>
                    <MenuItem value="COUPON">Coupon</MenuItem>
                  </Select>
                </FormControl>

                {formData.actionType !== 'NONE' && (
                  <TextField
                    label="Action Value"
                    fullWidth
                    margin="normal"
                    value={formData.actionValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionValue: e.target.value
                      })
                    }
                  />
                )}

                <TextField
                  label="Display Order"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: Number(e.target.value)
                    })
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked
                        })
                      }
                    />
                  }
                  label="Active"
                />

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading || !formData.imageUrl}>
                  {loading ? 'Processing...' : selectedBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BannersDashboard;
