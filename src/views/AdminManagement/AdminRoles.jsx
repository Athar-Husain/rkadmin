// ./RegionList.jsx
import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Modal,
    Fade,
    Backdrop,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddRoles from './AddRoles';


// resolve(['Radio-Park', 'Cowl-Bazar', 'City', 'North', 'South', 'Central-Ballari',]);

const initialRoles = [
    { id: 1, name: 'Super Admin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Manager' },
    { id: 4, name: 'Supervisor' },
    { id: 5, name: 'Support' },
];


const AdminRoles = () => {
    const [regions, setRegions] = useState(initialRoles);
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const handleAddRoles = (newRegionName) => {
        const newRegion = {
            id: regions.length + 1,
            name: newRegionName,
        };
        setRegions((prev) => [...prev, newRegion]);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Region Name', flex: 1 },
    ];

    return (
        <>

            <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
                <Typography variant='h6' >Note: this Role is for the Admin Roles, like Departments</Typography>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h5" fontWeight={600}>
                        Roles
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>
                        Create Roles
                    </Button>
                </Grid>

                <Paper sx={{ height: 400, p: 2 }}>
                    <DataGrid
                        rows={regions}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5, page: 0 } },
                        }}
                    />
                </Paper>

                {/* Create Region Modal */}
                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 300 }}
                >
                    <Fade in={open}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 24,
                                p: 3,
                            }}
                        >
                            <Typography variant="h6" mb={2}>
                                Create Region
                            </Typography>
                            <AddRoles
                                onClose={handleCloseModal}
                                onSubmitRegion={handleAddRoles}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    );
};

export default AdminRoles;
