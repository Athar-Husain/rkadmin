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
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  Switch,
  InputAdornment
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createPromotion, updatePromotion } from '../../redux/features/Promotions/PromotionSlice';

const PromotionModal = ({ open, onClose, promotion }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    type: 'DISCOUNT',
    value: 0,
    status: 'DRAFT',
    validFrom: '',
    validUntil: '',
    maxRedemptions: 1000,
    featured: false,
    targeting: { type: 'ALL' }
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        validFrom: promotion.validFrom ? new Date(promotion.validFrom).toISOString().slice(0, 16) : '',
        validUntil: promotion.validUntil ? new Date(promotion.validUntil).toISOString().slice(0, 16) : ''
      });
    }
  }, [promotion]);

  const handleSave = () => {
    if (promotion) {
      dispatch(updatePromotion({ id: promotion._id, data: formData }));
    } else {
      dispatch(createPromotion(formData));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>{promotion ? 'Edit Promotion' : 'Configure New Promotion'}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <TextField
                label="Promotion Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                label="Short Description"
                fullWidth
                multiline
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <TextField
                select
                label="Status"
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {['DRAFT', 'ACTIVE', 'PAUSED'].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                }
                label="Featured on Home Screen"
              />
            </Stack>
          </Grid>

          <Grid size={{xs:12}}>
            <Divider>
              <Typography variant="caption" fontWeight={800} color="text.disabled">
                OFFER CONFIGURATION
              </Typography>
            </Divider>
          </Grid>

          {/* Type & Value */}
          <Grid size={{xs:12, md:6}}>
            <TextField
              select
              label="Offer Type"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {['DISCOUNT', 'BOGO', 'FREE_ITEM', 'CASHBACK', 'REWARD_POINTS'].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              label="Value"
              type="number"
              fullWidth
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹/%</InputAdornment> }}
            />
          </Grid>

          {/* Limits & Dates */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Redemption Limit"
              type="number"
              fullWidth
              value={formData.maxRedemptions}
              onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Valid From"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Valid Until"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </Grid>

          <Grid size={{xs:12}}>
            <Divider>
              <Typography variant="caption" fontWeight={800} color="text.disabled">
                TARGETING
              </Typography>
            </Divider>
          </Grid>

          <Grid size={{xs:12}}>
            <Stack direction="row" spacing={4}>
              <TextField
                select
                label="Target Audience"
                sx={{ width: 250 }}
                value={formData.targeting.type}
                onChange={(e) => setFormData({ ...formData, targeting: { ...formData.targeting, type: e.target.value } })}
              >
                {['ALL', 'GEOGRAPHIC', 'SEGMENT', 'INDIVIDUAL'].map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                {formData.targeting.type === 'ALL'
                  ? 'This promotion will be visible to every registered user.'
                  : 'Additional targeting filters will apply.'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ borderRadius: '10px', px: 4, fontWeight: 700 }}>
          Save Promotion
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionModal;
