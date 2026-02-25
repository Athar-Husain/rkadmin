import { DataGrid } from '@mui/x-data-grid';
import CityStatusToggle from './CityStatusToggle';
import AreaDrawer from './AreaDrawer';
import { useState } from 'react';

const CityTable = ({ cities = [], loading }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const columns = [
    {
      field: 'sl',
      headerName: 'SL',
      width: 80
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1
    },
    {
      field: 'areas',
      headerName: 'Areas',
      width: 120,
      renderCell: (params) => params.row.areas.length
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <CityStatusToggle city={params.row.city} isActive={params.row.isActive} />
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => setSelectedCity(params.row)}>
          View Areas
        </span>
      )
    }
  ];

  const rows = cities.map((c, index) => ({
    id: c._id,
    sl: index + 1,
    city: c.city,
    areas: c.areas,
    isActive: c.isActive
  }));

  return (
    <>
      <DataGrid rows={rows} columns={columns} autoHeight loading={loading} disableRowSelectionOnClick />

      {selectedCity && <AreaDrawer cityData={selectedCity} onClose={() => setSelectedCity(null)} />}
    </>
  );
};

export default CityTable;
