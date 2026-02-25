import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const TabNavigation = ({ currentTab, onTabChange }) => {
    const tabs = ['New Customer', 'Existing Customer'];
    const tabIndex = tabs.indexOf(currentTab);

    const handleTabChange = (event, newValue) => {
        onTabChange(tabs[newValue]);
    };

    return (
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                {tabs.map((tab, index) => (
                    <Tab label={tab} key={index} />
                ))}
            </Tabs>
        </Box>
    );
};

export default TabNavigation;
