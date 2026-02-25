import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createCouponAdmin } from '../../redux/features/Coupons/CouponSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const CreateCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      discount: '',
      expiryDate: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      code: Yup.string().required('Required'),
      discount: Yup.number().required('Required').min(0),
      expiryDate: Yup.date().required('Required')
    }),
    onSubmit: (values) => {
      dispatch(createCouponAdmin(values)).then(() => navigate('/coupons'));
    }
  });

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={3}>
        Create Coupon
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Coupon Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Coupon Code"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Discount"
          name="discount"
          type="number"
          value={formik.values.discount}
          onChange={formik.handleChange}
          error={formik.touched.discount && Boolean(formik.errors.discount)}
          helperText={formik.touched.discount && formik.errors.discount}
        />
        <TextField
          fullWidth
          margin="normal"
          type="date"
          name="expiryDate"
          InputLabelProps={{ shrink: true }}
          value={formik.values.expiryDate}
          onChange={formik.handleChange}
          error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
          helperText={formik.touched.expiryDate && formik.errors.expiryDate}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Create
        </Button>
      </form>
    </Box>
  );
};

export default CreateCoupon;
