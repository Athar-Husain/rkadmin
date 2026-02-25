// ./RegionList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Modal,
    Fade,
    Backdrop,
    Stack,
    IconButton,
    Tooltip,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRegion from './AddRegion';
import { useDispatch, useSelector } from 'react-redux';

import {
    getAllServiceAreas,
    deleteServiceArea,
} from '../../redux/features/Area/AreaSlice';

const RegionList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setOpen(false);
    };

    const { areas, isAreaLoading } = useSelector(
        (state) => state.serviceArea || state.area
    );

    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This region will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF4D6D', // Soft pink-red
            cancelButtonColor: '#6C63FF', // Cool violet
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'swal2-border-radius',
                confirmButton: 'swal2-btn-confirm',
                cancelButton: 'swal2-btn-cancel',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteServiceArea(id)).then(() => {
                    dispatch(getAllServiceAreas());
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Region has been deleted.',
                        timer: 1800,
                        showConfirmButton: false,
                        background: '#F6F8FF',
                        color: '#333',
                    });
                });
            }
        });
    };

    const columns = [
        {
            field: 'region',
            headerName: 'Area Name',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            sortable: true,
            filterable: true,
            cellClassName: 'region-cell',
        },
        // {
        //     field: 'status',
        //     headerName: 'Status',
        //     width: 130,
        //     renderCell: (params) => (
        //         <Typography
        //             sx={{
        //                 color:
        //                     params.value === 'Active'
        //                         ? '#4CAF50' // bright green
        //                         : '#9E9E9E', // gray
        //                 fontWeight: '600',
        //                 textTransform: 'capitalize',
        //                 fontSize: 14,
        //             }}
        //         >
        //             {params.value || '—'}
        //         </Typography>
        //     ),
        //     headerAlign: 'center',
        //     align: 'center',
        // },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (params) => {
                const statusColors = {
                    active: { bg: '#D4EDDA', color: '#28A745' },        // light green bg, dark green text
                    inactive: { bg: '#F8D7DA', color: '#DC3545' },      // light red bg, dark red text
                    slow: { bg: '#FFF3CD', color: '#FFC107' },          // light orange bg, amber text
                    under_maintenance: { bg: '#D1ECF1', color: '#17A2B8' }, // light blue bg, blue text
                };

                const statusKey = params.value?.toLowerCase() || 'inactive'; // fallback to inactive style
                const colors = statusColors[statusKey] || { bg: '#E2E3E5', color: '#6C757D' }; // default gray

                return (
                    <Box
                        sx={{
                            // backgroundColor: colors.bg,
                            color: colors.color,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            fontWeight: '600',
                            fontSize: 13,
                            textTransform: 'capitalize',
                            textAlign: 'center',
                            minWidth: 90,
                            userSelect: 'none',
                        }}
                    >
                        {params.value?.replace(/_/g, ' ') || '—'}
                    </Box>
                );
            },
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            renderCell: (params) =>
                params?.row?.createdAt
                    ? new Date(params.row.createdAt).toLocaleString()
                    : '—',
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'date-cell',
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            flex: 1,
            renderCell: (params) =>
                params?.row?.updatedAt
                    ? new Date(params.row.updatedAt).toLocaleString()
                    : '—',
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'date-cell',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="View Region" arrow>
                        <IconButton
                            aria-label="view region"
                            color="primary"
                            onClick={() => navigate(`/areas/${params.row._id}/view`)}
                            size="small"
                            sx={{
                                bgcolor: '#E8F0FE',
                                color: '#3366FF',
                                '&:hover': { bgcolor: '#C1D7FF' },
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(51, 102, 255, 0.3)',
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Region" arrow>
                        <IconButton
                            aria-label="edit region"
                            color="secondary"
                            onClick={() => navigate(`/areas/${params.row._id}/edit`)}
                            size="small"
                            sx={{
                                bgcolor: '#FFF4E5',
                                color: '#FFB74D',
                                '&:hover': { bgcolor: '#FFE0B2' },
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(255, 183, 77, 0.3)',
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Region" arrow>
                        <IconButton
                            aria-label="delete region"
                            color="error"
                            onClick={() => handleDelete(params.row._id)}
                            size="small"
                            sx={{
                                bgcolor: '#FFE5E5',
                                color: '#FF4D6D',
                                '&:hover': { bgcolor: '#FFB2B2' },
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(255, 77, 109, 0.3)',
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    return (
        <>
            <Box
                sx={{
                    maxWidth: 1100,
                    mx: 'auto',
                    px: { xs: 2, sm: 3 },
                    py: 4,
                    bgcolor: '#F9FAFF',
                    borderRadius: 3,
                    boxShadow:
                        '0 8px 16px rgba(51, 102, 255, 0.05), 0 4px 8px rgba(51, 102, 255, 0.1)',
                    fontFamily: "'Poppins', sans-serif",
                    color: '#1F2937',
                    minHeight: '80vh',
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        color: '#6B7280', // Tailwind gray-500
                        fontStyle: 'italic',
                        maxWidth: 650,
                        lineHeight: 1.5,
                    }}
                >
                    Note: This region defines the area allocation for teams and customers.
                    Complaints are assigned based on these regions.
                </Typography>

                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                            color: '#4F46E5', // Indigo-600
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Area / Network
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        sx={{
                            bgcolor: '#6366F1', // Indigo-500
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: 16,
                            borderRadius: 8,
                            boxShadow: '0 6px 12px rgba(99, 102, 241, 0.4)',
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#4F46E5',
                                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.5)',
                            },
                        }}
                    >
                        + Create Region
                    </Button>
                </Grid>

                {!isAreaLoading && areas.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="#9CA3AF" // Tailwind gray-400
                        sx={{ mt: 6, textAlign: 'center', fontSize: 16 }}
                    >
                        No regions found.
                    </Typography>
                ) : (
                    <Paper
                        elevation={6}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow:
                                '0 12px 24px rgba(99, 102, 241, 0.15), 0 6px 12px rgba(99, 102, 241, 0.1)',
                            bgcolor: '#FFFFFF',
                        }}
                    >
                        <DataGrid
                            rows={areas.map((r) => ({ ...r, id: r._id }))}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                            }}
                            autoHeight
                            disableRowSelectionOnClick
                            sx={{
                                border: 'none',
                                fontSize: 14,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#EEF2FF', // Indigo-50
                                    color: '#4338CA', // Indigo-700
                                    fontWeight: 700,
                                    fontSize: 15,
                                    borderBottom: '1px solid #E0E7FF',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #E0E7FF',
                                },
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: '#FAFAFF',
                                },
                                '& .region-cell': {
                                    fontWeight: 600,
                                    color: '#4338CA', // Indigo-700
                                },
                                '& .date-cell': {
                                    color: '#6B7280',
                                    fontStyle: 'italic',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid #E0E7FF',
                                },
                            }}
                        />
                    </Paper>
                )}

                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: { timeout: 300 },
                    }}
                    aria-labelledby="modal-create-region-title"
                    aria-describedby="modal-create-region-description"
                >
                    <Fade in={open}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: 320, sm: 420 },
                                bgcolor: '#fff',
                                borderRadius: 3,
                                boxShadow:
                                    '0 12px 24px rgba(99, 102, 241, 0.3), 0 6px 12px rgba(99, 102, 241, 0.2)',
                                p: 4,
                                outline: 'none',
                            }}
                            tabIndex={-1}
                        >
                            <Typography
                                id="modal-create-region-title"
                                variant="h5"
                                fontWeight={700}
                                mb={3}
                                color="#4F46E5"
                            >
                                Add a New Service Region
                            </Typography>
                            <AddRegion onClose={handleCloseModal} />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
            {/* SweetAlert2 custom styles */}
            <style>{`
        .swal2-border-radius {
          border-radius: 12px !important;
          font-family: 'Poppins', sans-serif !important;
        }
        .swal2-btn-confirm {
          background-color: #FF4D6D !important;
          color: white !important;
          font-weight: 700 !important;
          border-radius: 8px !important;
          padding: 10px 24px !important;
          font-size: 16px !important;
          box-shadow: 0 6px 12px rgba(255, 77, 109, 0.5) !important;
          transition: background-color 0.3s ease !important;
        }
        .swal2-btn-confirm:hover {
          background-color: #e43c5c !important;
        }
        .swal2-btn-cancel {
          background-color: #6C63FF !important;
          color: white !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          padding: 10px 24px !important;
          font-size: 16px !important;
          box-shadow: 0 6px 12px rgba(108, 99, 255, 0.5) !important;
          transition: background-color 0.3s ease !important;
        }
        .swal2-btn-cancel:hover {
          background-color: #574fdb !important;
        }
      `}</style>
        </>
    );
};

export default RegionList;
