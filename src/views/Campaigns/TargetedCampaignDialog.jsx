import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { Send, LocationOn, ShoppingBag } from '@mui/icons-material';

const TargetedCampaignDialog = ({ open, onClose, onSend, coupon }) => {
  const [targetingData, setTargetingData] = useState({
    area: '',
    city: 'Ballari',
    purchasedCategory: '', // For retargeting (Scenario: Bought AC)
    excludeCategory: '', // For potential buyers (Scenario: No Washing Machine)
    title: `Special Offer: ${coupon?.title}`,
    message: `Limited time offer at RK Electronics!`
  });

  // These should ideally come from your backend Area Master
  const ballariAreas = ['Jagruti-nagar', 'Cowl Bazaar', 'Gandhinagar', 'Infantry Road'];
  const categories = ['AC', 'Washing Machine', 'Mobile', 'Refrigerator'];

  const handleSubmit = () => {
    onSend(targetingData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Send color="primary" /> Run Targeted Campaign
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <Alert severity="info">
            Targeting: <strong>{coupon?.code}</strong> ({coupon?.title})
          </Alert>

          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn fontSize="small" /> 1. Select Geographic Target
          </Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              select
              fullWidth
              label="City"
              value={targetingData.city}
              onChange={(e) => setTargetingData({ ...targetingData, city: e.target.value })}
            >
              <MenuItem value="Ballari">Ballari</MenuItem>
              <MenuItem value="Siruguppa">Siruguppa</MenuItem>
              <MenuItem value="Hospet">Hospet</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Area"
              value={targetingData.area}
              onChange={(e) => setTargetingData({ ...targetingData, area: e.target.value })}
            >
              <MenuItem value="">All Areas</MenuItem>
              {ballariAreas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBag fontSize="small" /> 2. Behavioral Retargeting
          </Typography>

          <TextField
            select
            fullWidth
            label="Retarget: Users who purchased..."
            helperText="Leave empty to ignore purchase history"
            value={targetingData.purchasedCategory}
            onChange={(e) => setTargetingData({ ...targetingData, purchasedCategory: e.target.value, excludeCategory: '' })}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat} Owners
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Prospect: Users who NEVER purchased..."
            helperText="Perfect for Jagruti-nagar 'No Washing Machine' scenario"
            value={targetingData.excludeCategory}
            onChange={(e) => setTargetingData({ ...targetingData, excludeCategory: e.target.value, purchasedCategory: '' })}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                Non-{cat} Owners
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              3. Notification Content
            </Typography>
            <TextField
              fullWidth
              label="Push Title"
              margin="dense"
              value={targetingData.title}
              onChange={(e) => setTargetingData({ ...targetingData, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Push Message"
              margin="dense"
              value={targetingData.message}
              onChange={(e) => setTargetingData({ ...targetingData, message: e.target.value })}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" startIcon={<Send />}>
          Send Push Notification
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TargetedCampaignDialog;
