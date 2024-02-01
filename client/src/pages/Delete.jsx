import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function DeleteAccount() {

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required'),
      confirmPassword: yup
        .string()
        .trim()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: (data) => {
        http
      .delete("/user/delete", data)
      .then((res) => {
        console.log(res.data);
        localStorage.clear();
        window.location = "/";
      })

      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });
    },
});

  return (
    <Box
    component="Box"
    sx={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: '1px solid #FFA500',
      borderRadius: '16px',
      padding: '5px',
      width: '50%',
      height: '50%',
      marginLeft: '25%',
      minHeight: '50vh'
    }}
    >
      <Typography variant="h5" sx={{ my: 2, fontFamily:"cursive" }}>
        Delete Account
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: '500px' }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Box
  sx={{
    marginTop: 2,
    display: 'flex',
    justifyContent: 'space-between',
  }}
>       
        <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#FFA500', borderRadius: '66px', width:'200px', height:'50px', fontFamily:"cursive" }} onClick={() => navigate('/login')} type="Cancel">
          Back
        </Button>
        <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: 'red', borderRadius: '66px', width:'200px', height:'50px',fontFamily:"cursive" }} type="submit">
          Delete Account
        </Button>
      </Box>
      <ToastContainer />
    </Box>
    </Box>
  );
}

export default DeleteAccount;
