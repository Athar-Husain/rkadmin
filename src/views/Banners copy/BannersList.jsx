import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllBanners, deleteBanner } from '.';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { fetchAllBanners,deleteBanner } from '../../redux/features/Banners/BannerSlice';

export default function BannerList() {
  const dispatch = useDispatch();
  const { banners, isBannerLoading } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(fetchAllBanners());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will deactivate the banner',
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) dispatch(deleteBanner(id));
    });
  };

  const columns = [
    { field: 'image', headerName: 'Thumbnail', renderCell: (params) => <img src={params.value} alt="" width={60} /> },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'displayOrder', headerName: 'Order', width: 100 },
    { field: 'isActive', headerName: 'Status', width: 120, renderCell: (params) => (params.value ? 'Active' : 'Inactive') },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              /* navigate to edit */
            }}
          >
            Edit
          </Button>
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(params.id)}>
            Deactivate
          </Button>
        </>
      )
    }
  ];

  return <DataGrid rows={banners} columns={columns} loading={isBannerLoading} autoHeight pageSize={20} />;
}
