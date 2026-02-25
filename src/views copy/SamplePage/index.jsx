import React from 'react';

// material-ui
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Box,
} from '@mui/material';

// project import
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';

const SamplePage = () => {
  return (
    <>
      <Breadcrumbs
        title="Sample Page"
        links={[
          { label: 'Dashboard', to: '/' },
          { label: 'Sample Page' }, // no `to` means current page
        ]}
        divider
      />

      <Grid container spacing={gridSpacing} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card
            elevation={4}
            sx={{
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': { boxShadow: 12 },
              borderRadius: 2,
            }}
          >
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Sample Page
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  href="/"
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                >
                  Go to Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SamplePage;
