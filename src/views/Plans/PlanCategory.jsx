import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  Tooltip,
  TextField,
  DialogActions,
  Drawer,
  Divider,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';

import { toast } from 'react-toastify';
import { getAllPlanCategories, deletePlanCategory, updatePlanCategory, createPlanCategory } from '../../redux/features/Plan/PlanSlice';

import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';

const PlanCategory = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { categories: allplanCategories, isPlanLoading, isPlanError } = useSelector((state) => state.plan);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false); // Toggle between View and Edit in the drawer
  const [activeCategory, setActiveCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(getAllPlanCategories());
  }, [dispatch]);

  // Handlers
  const openPanel = (category = { name: '', description: '' }, isView = false) => {
    setActiveCategory(category);
    setViewMode(isView);
    setSidePanelOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deletePlanCategory(categoryToDelete)).unwrap();
      toast.success('Category removed');
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setConfirmModalOpen(false);
    }
  };

  const handleSave = async () => {
    try {
      if (activeCategory?._id) {
        await dispatch(updatePlanCategory({ id: activeCategory._id, data: activeCategory })).unwrap();
        toast.success('Category updated');
      } else {
        await dispatch(createPlanCategory(activeCategory)).unwrap();
        toast.success('Category created');
      }
      setSidePanelOpen(false);
      dispatch(getAllPlanCategories());
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const columns = useMemo(
    () => [
      { field: 'sl', headerName: '#', width: 60, align: 'center' },
      {
        field: 'name',
        headerName: 'Category Name',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {params.value}
          </Typography>
        )
      },
      { field: 'description', headerName: 'Description', flex: 2, color: 'text.secondary' },
      //   {
      //     field: 'createdAt',
      //     headerName: 'Date Created',
      //     width: 150,
      //     valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString()
      //   },
      {
        field: 'createdAt',
        headerName: 'Date Created',
        width: 150,
        valueGetter: (params) => new Date(params.row?.createdAt ?? NaN).toLocaleDateString() || '-'
      },

      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => openPanel(params.row, true)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => openPanel(params.row, false)}
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              >
                <EditTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setCategoryToDelete(params.row._id);
                  setConfirmModalOpen(true);
                }}
                sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}
              >
                <DeleteTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [theme]
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#fdfdfd', minHeight: '100vh' }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A1C1E', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CategoryTwoToneIcon color="primary" fontSize="large" /> Plan Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and group your internet plans for better organization.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openPanel()}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
          }}
        >
          Create Category
        </Button>
      </Stack>

      {/* Table Section */}
      {isPlanError ? (
        <Alert severity="error" variant="outlined">
          Error loading categories. Please refresh.
        </Alert>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <DataGrid
            rows={allplanCategories?.map((cat, index) => ({ ...cat, id: cat._id, sl: index + 1 })) || []}
            columns={columns}
            loading={isPlanLoading}
            pageSize={10}
            autoHeight
            disableRowSelectionOnClick
            components={{
              Toolbar: () => (
                <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
                  <GridToolbarQuickFilter sx={{ width: 250 }} />
                </Box>
              )
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#F8FAFC',
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              },
              '& .MuiDataGrid-cell:focus': { outline: 'none' }
            }}
          />
        </Paper>
      )}

      {/* Side Panel (Drawer) for View/Edit/Create */}
      <Drawer
        anchor="right"
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 450 }, p: 0 } }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={700}>
              {viewMode ? 'Category Details' : activeCategory?._id ? 'Edit Category' : 'New Category'}
            </Typography>
            <IconButton onClick={() => setSidePanelOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Stack spacing={3} sx={{ flexGrow: 1 }}>
            <TextField
              label="Category Name"
              fullWidth
              variant={viewMode ? 'filled' : 'outlined'}
              InputProps={{ readOnly: viewMode }}
              value={activeCategory.name}
              onChange={(e) => setActiveCategory({ ...activeCategory, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant={viewMode ? 'filled' : 'outlined'}
              InputProps={{ readOnly: viewMode }}
              value={activeCategory.description}
              onChange={(e) => setActiveCategory({ ...activeCategory, description: e.target.value })}
            />
            {viewMode && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Internal ID: {activeCategory._id}
                </Typography>
              </Box>
            )}
          </Stack>

          {!viewMode && (
            <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSave}
                disabled={!activeCategory.name}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {activeCategory?._id ? 'Save Changes' : 'Create Category'}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <ConfirmDialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message="This will remove the category. Plans assigned to this category may lose their grouping."
      />
    </Box>
  );
};

export default PlanCategory;
