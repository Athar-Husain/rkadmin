import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, alpha, useTheme, Stack, Divider } from '@mui/material';
import { PersonAddRounded as NewIcon, GroupAddRounded as ExistingIcon, ChevronRightRounded as ArrowIcon } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewCustomerWizard from './NewCustomer/NewCustomerWizard';
import ExistingCustomerWizard from './ExistingCustomer/ExistingCustomerWizard';

const AddCustomer = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', pb: 6 }}>
      {/* HEADER SECTION */}
      <Box sx={{ bgcolor: '#fff', pt: 4, pb: 1, borderBottom: '1px solid #E0E5F2' }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              Management
            </Typography>
            <ArrowIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              Add Customer
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight={800} sx={{ color: '#1B2559', mb: 0.5 }}>
            Customer Onboarding
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
            Follow the wizard to register new accounts or upgrade services for existing subscribers.
          </Typography>

          {/* REFINED TABS */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              minHeight: 40,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                bgcolor: '#4318FF',
                justifyContent: 'center'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 160,
                minHeight: 40,
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#A3AED0',
                justifyContent: 'center',
                transition: 'color 0.2s',
                
                '&.Mui-selected': {
                  color: '#1B2559'
                },
                '&:hover': {
                  color: '#707EAE',
                  bgcolor: alpha(theme.palette.primary.main, 0.02)
                }
              }
            }}
          >
            <Tab icon={<NewIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="New Individual" />
            <Tab icon={<ExistingIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Existing Client" />
          </Tabs>
        </Container>
      </Box>

      {/* DYNAMIC CONTENT AREA */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            width: '100%',
            animation: 'fadeIn 0.3s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {tabIndex === 0 ? <NewCustomerWizard /> : <ExistingCustomerWizard />}
        </Box>
      </Container>

      {/* GLOBAL NOTIFICATIONS - Smaller & Cleaner */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="light"
        hideProgressBar={true}
        toastStyle={{
          borderRadius: '16px',
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
