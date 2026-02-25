import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, alpha, useTheme, Stack } from '@mui/material';
import { PersonAddRounded as NewIcon, GroupAddRounded as ExistingIcon, ChevronRightRounded as ArrowIcon } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewCustomerWizard from './NewCustomer/NewCustomerWizard';
import ExistingCustomerWizard from './ExistingCustomer/ExistingCustomerWizard';

const AddCustomer = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', pb: 6 }}>
      {/* HEADER */}
      <Box sx={{ bgcolor: '#fff', pt: 4, pb: 3, borderBottom: '1px solid #E0E5F2' }}>
        <Container maxWidth="lg">
          {/* Breadcrumb */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
              Management
            </Typography>
            <ArrowIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ letterSpacing: 1 }}>
              Add Customer
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight={800} sx={{ color: '#1B2559' }}>
            Customer Onboarding
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 620 }}>
            Follow the wizard to register new accounts or upgrade services for existing subscribers.
          </Typography>

          {/* 🎯 CENTERED TAB CONTAINER */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 0.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              centered
              sx={{
                minHeight: 42,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2,
                  bgcolor: '#4318FF'
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  minHeight: 42,
                  minWidth: 170,
                  color: '#A3AED0',
                  transition: 'all 0.2s ease',
                  borderRadius: 2,

                  '&.Mui-selected': {
                    color: '#1B2559'
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.06)
                  }
                }
              }}
            >
              <Tab icon={<NewIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="New Individual" />
              <Tab icon={<ExistingIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Existing Client" />
            </Tabs>
          </Paper>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            animation: 'fadeIn 0.25s ease-in-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {tabIndex === 0 ? <NewCustomerWizard /> : <ExistingCustomerWizard />}
        </Box>
      </Container>

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        toastStyle={{
          borderRadius: 16,
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid #E0E5F2'
        }}
      />
    </Box>
  );
};

export default AddCustomer;
