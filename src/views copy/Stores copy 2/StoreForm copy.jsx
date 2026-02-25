import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Grid, Paper, Typography, MenuItem, Stack } from '@mui/material';

const StoreForm = ({ initialData, onSubmit, title, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Retail',
    location: { city: '', area: '', address: '', gmapsLink: '' },
    contact: { phone: '', email: '' }
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={800} mb={3}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Store Name" name="name" value={formData.name} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Store Code" name="code" value={formData.code} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField select fullWidth label="Type" name="type" value={formData.type} onChange={handleChange}>
              {['Retail', 'Wholesale', 'Warehouse', 'Outlet'].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Google Maps Link"
              name="location.gmapsLink"
              value={formData.location.gmapsLink || ''}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/place/..."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="City" name="location.city" value={formData.location.city} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Phone" name="contact.phone" value={formData.contact.phone} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Store'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StoreForm;
