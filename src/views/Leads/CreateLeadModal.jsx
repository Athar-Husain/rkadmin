import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Stack, Box, Typography, Alert, Divider } from '@mui/material';
import { CloudUpload, Download, Save } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createAdminLead, bulkUploadLeads, getAllLeads } from '../../redux/features/Leads/LeadSlice';

const CreateLeadModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('manual'); // 'manual' or 'bulk'
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', area: '', address: '', notes: '' });

  const handleDownloadTemplate = () => {
    const csvContent =
      'name,phone,area,email,address,notes\n' +
      'John Doe,9876543210,Downtown,john@example.com,House 123 Street 4,High priority lead\n' +
      'Jane Smith,8877665544,North Park,jane@test.com,Flat 402,Interested in 50Mbps';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_template_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleManualSubmit = async () => {
    // Map 'area' string to the 'serviceArea' field expected by schema
    const submitData = { ...formData, serviceArea: formData.area };
    await dispatch(createAdminLead(submitData));
    dispatch(getAllLeads({ status: 'new' }));
    onClose();
  };

  const handleBulkSubmit = async () => {
    if (!file) return;
    await dispatch(bulkUploadLeads(file));
    dispatch(getAllLeads({ status: 'new' }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Add New Prospects</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} mb={3} justifyContent="center">
          <Button variant={mode === 'manual' ? 'contained' : 'outlined'} onClick={() => setMode('manual')}>
            Single Entry
          </Button>
          <Button variant={mode === 'bulk' ? 'contained' : 'outlined'} onClick={() => setMode('bulk')}>
            Bulk Upload
          </Button>
        </Stack>

        {mode === 'manual' ? (
          <Stack spacing={2}>
            <TextField label="Customer Name" fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Phone Number" fullWidth onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField label="Area (e.g. Sector 5)" fullWidth onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
            <TextField
              label="Full Address"
              multiline
              rows={2}
              fullWidth
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Button variant="contained" startIcon={<Save />} onClick={handleManualSubmit} size="large">
              Create Lead
            </Button>
          </Stack>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Upload a CSV file. Use the template below to ensure column names match exactly.
            </Alert>
            <Box
              sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', bgcolor: '#f9f9f9', cursor: 'pointer', borderRadius: 2 }}
              onClick={() => document.getElementById('csv-file').click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" fontWeight={600}>
                {file ? file.name : 'Click to select CSV'}
              </Typography>
              <input type="file" id="csv-file" hidden accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            </Box>
            <Stack direction="row" spacing={2} mt={3}>
              <Button fullWidth variant="outlined" startIcon={<Download />} onClick={handleDownloadTemplate}>
                Template
              </Button>
              <Button fullWidth variant="contained" disabled={!file} onClick={handleBulkSubmit}>
                Upload Now
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadModal;
