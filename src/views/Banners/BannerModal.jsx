import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  alpha,
  Divider,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createBanner, updateBanner } from '../../redux/features/Banners/BannerSlice';
import { toast } from 'react-toastify';

const BannerModal = ({ open, onClose, banner }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    actionType: 'NONE',
    actionValue: '',
    startDate: '',
    endDate: '',
    displayOrder: 0,
    isActive: true,
    targeting: { type: 'ALL' }
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        ...banner,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
        endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : ''
      });
    }
  }, [banner]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (banner) {
        await dispatch(updateBanner({ id: banner._id, data: formData })).unwrap();
        toast.success('Campaign updated');
      } else {
        await dispatch(createBanner(formData)).unwrap();
        toast.success('Campaign launched');
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {banner ? 'Edit Campaign' : 'New Promotional Campaign'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* section 1: Basic Info */}
          <Grid size={{xs:12, md:7}}>
            <Stack spacing={2.5}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Basic Information
              </Typography>
              <TextField
                label="Campaign Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <TextField
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </Stack>
            </Stack>
          </Grid>

          {/* Section 2: Image & Preview */}
          <Grid size={{xs:12, md:5}}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Visual Assets
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 140,
                  borderRadius: '12px',
                  bgcolor: '#f1f5f9',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UploadIcon sx={{ color: 'text.disabled', fontSize: 40 }} />
                )}
              </Box>
              <TextField
                label="Image URL"
                size="small"
                fullWidth
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </Stack>
          </Grid>

          <Grid size={{xs:12}}>
            <Divider />
          </Grid>

          {/* Section 3: Configuration */}
          <Grid size={{xs:12, md:6}}>
            <Stack spacing={2}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Interaction
              </Typography>
              <TextField
                select
                label="Action Type"
                fullWidth
                value={formData.actionType}
                onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
              >
                {['NONE', 'URL', 'PRODUCT', 'CATEGORY', 'STORE', 'COUPON'].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
              {formData.actionType !== 'NONE' && (
                <TextField
                  label="Action Value (ID or URL)"
                  fullWidth
                  value={formData.actionValue}
                  onChange={(e) => setFormData({ ...formData, actionValue: e.target.value })}
                />
              )}
            </Stack>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Stack spacing={2}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Visibility
              </Typography>
              <TextField
                label="Display Priority"
                type="number"
                fullWidth
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
              />
              <FormControlLabel
                control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />}
                label="Active Status"
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.imageUrl || !formData.title}
          sx={{ borderRadius: '10px', px: 4, fontWeight: 700 }}
        >
          {loading ? 'Processing...' : banner ? 'Update Campaign' : 'Launch Campaign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerModal;
