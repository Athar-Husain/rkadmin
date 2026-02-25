import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    getAllServiceAreas,
    createServiceArea,
    updateServiceArea
} from '../../redux/features/Area/AreaSlice'; // Adjust path as needed

export default function Network() {
    const dispatch = useDispatch();

    const { areas, isAreaError, message } = useSelector((state) => state.area);

    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentArea, setCurrentArea] = useState(null);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            region: '',
            description: '',
        },
    });

    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    useEffect(() => {
        if (isAreaError) {
            toast.error(message);
        }
    }, [isAreaError, message]);

    const onSubmit = async (data) => {
        if (isEditMode && currentArea) {
            dispatch(updateServiceArea({ id: currentArea._id, data }))
                .unwrap()
                .then(() => {
                    toast.success('Service area updated');
                    handleClose();
                })
                .catch((err) => {
                    toast.error(err);
                });
        } else {
            dispatch(createServiceArea(data))
                .unwrap()
                .then(() => {
                    toast.success('Service area created');
                    handleClose();
                })
                .catch((err) => {
                    toast.error(err);
                });
        }
    };

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setCurrentArea(null);
        reset();
        setOpen(true);
    };

    const handleOpenEdit = (area) => {
        setIsEditMode(true);
        setCurrentArea(area);
        reset({
            region: area.region,
            description: area.description,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        setCurrentArea(null);
    };

    return (
        <Box p={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Service Areas</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                    Add Area
                </Button>
            </Stack>

            {/* Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Region</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {areas.map((area) => (
                        <TableRow key={area._id}>
                            <TableCell>{area.region}</TableCell>
                            <TableCell>{area.description}</TableCell>
                            <TableCell>{area.status || 'N/A'}</TableCell>
                            <TableCell>{area.isActive ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" title="View">
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton color="secondary" title="Edit" onClick={() => handleOpenEdit(area)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{isEditMode ? 'Edit Service Area' : 'Create Service Area'}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Stack spacing={2}>
                            <Controller
                                name="region"
                                control={control}
                                rules={{ required: 'Region is required' }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Region"
                                        fullWidth
                                        {...field}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField label="Description" multiline rows={3} fullWidth {...field} />
                                )}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
