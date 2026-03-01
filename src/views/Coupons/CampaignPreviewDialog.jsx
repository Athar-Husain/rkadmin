import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';

export default function CampaignPreviewDialog({
  open,
  onClose,
  onConfirm,
  formData,
  csvSummary
}) {
  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={800}>
        Campaign Preview
      </DialogTitle>

      <DialogContent dividers>
        <Typography fontWeight={700}>
          {formData.title}
        </Typography>

        <Typography mt={1}>
          Code: <b>{formData.code}</b>
        </Typography>

        <Typography mt={1}>
          Discount: {formData.type === 'PERCENTAGE'
            ? `${formData.value}%`
            : `₹${formData.value}`}
        </Typography>

        <Box mt={2}>
          <Chip
            label={`Targeting: ${formData.targeting.type}`}
            color="primary"
          />
        </Box>

        {csvSummary && (
          <Box mt={2}>
            <Typography fontWeight={600}>
              CSV Summary
            </Typography>
            <Typography>Total: {csvSummary.total}</Typography>
            <Typography color="success.main">
              Valid: {csvSummary.valid}
            </Typography>
            {csvSummary.invalid > 0 && (
              <Typography color="error.main">
                Invalid: {csvSummary.invalid}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Back</Button>
        <Button
          variant="contained"
          onClick={onConfirm}
        >
          Launch Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
}