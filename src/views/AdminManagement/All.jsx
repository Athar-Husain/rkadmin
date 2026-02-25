import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    IconButton,
    Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';

// Sample data for demonstration
const rows = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'technician',
        status: 'active',
        region: ['East-Mumbai', 'West'],
        createdAt: '2025-06-25',
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'agent',
        status: 'inactive',
        region: ['South', 'Central-Mumbai'],
        createdAt: '2025-04-15',
    },
    {
        id: 3,
        firstName: 'Mike',
        lastName: 'Lee',
        email: 'mike@example.com',
        role: 'technician',
        status: 'suspended',
        region: ['North'],
        createdAt: '2025-03-10',
    }
];

// Column configuration
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
        field: 'region',
        headerName: 'Region(s)',
        flex: 1.5,
        renderCell: (params) => (
            <div>
                {params.value.map((region, index) => (
                    <div key={index}>{region}</div>
                ))}
            </div>
        ),
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : '',

    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Stack direction="row" spacing={1}>
                <IconButton color="primary" aria-label="view">
                    <VisibilityIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="edit">
                    <EditIcon />
                </IconButton>
                <IconButton color="error" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </Stack>
        ),
    },
];

const All = () => {
    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns
            .filter(col => col.field !== 'actions')
            .map(col => col.headerName);

        const tableRows = rows.map(row =>
            columns
                .filter(col => col.field !== 'actions')
                .map(col => {
                    if (col.field === 'region') {
                        return row.region.join(', ');
                    }
                    if (col.valueGetter) {
                        return col.valueGetter({ row }) || '';
                    }
                    return row[col.field] ?? '';
                })
        );

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('team.pdf');
    };

    const exportExcel = () => {
        const data = rows.map(row => {
            const rowData = {};
            columns.forEach(col => {
                if (col.field === 'actions') return;
                if (col.field === 'region') {
                    rowData[col.headerName] = row.region.join(', ');
                } else if (col.valueGetter) {
                    rowData[col.headerName] = col.valueGetter({ row }) || '';
                } else {
                    rowData[col.headerName] = row[col.field] ?? '';
                }
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Team");

        XLSX.writeFile(workbook, "team.xlsx");
    };

    return (
        <>
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Admin' },
                    { label: 'All' },
                ]}
                divider
            />
            <Box sx={{ height: 600, width: '100%', p: 3, bgcolor: '#f9fbff' }}>
                <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Team Members
                    </Typography>
                    <Box>
                        <Button onClick={exportPDF} variant="outlined" color="primary" sx={{ mr: 1 }}>
                            Export PDF
                        </Button>
                        <Button onClick={exportExcel} variant="outlined" color="secondary">
                            Export Excel
                        </Button>
                    </Box>
                </Grid>

                <Paper sx={{ height: 'auto' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                    page: 0,
                                },
                            },
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                        showToolbar
                    />
                </Paper>
            </Box>
        </>
    );
};

export default All;
