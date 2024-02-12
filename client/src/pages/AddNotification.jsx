import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddNotification() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            startDate: null,
            endDate: null,
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Notification Name must be at least 3 characters')
                .max(100, 'Notification Name must be at most 100 characters')
                .required('Notification Name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            startDate: yup.date(),
            endDate: yup.date(),
                
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.description = data.description.trim();
            //data.endDate = data.endDate.trim();
            // Format the endDate before sending it to the server

            if (imageFile) {
                data.imageFile = imageFile;
            };

            http.post("/notification", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/notifications");
                })
                .catch((error) => {
                    console.error("Error submitting data:", error);
                });
        }
    });

    const formatDate = (date) => {
        return date ? format(date, 'DD-MM-yyyy') : '';
    };

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
          if (file.size > 1024 * 1024) {
            toast.error("Maximum file size is 1MB");
            return;
          }
    
          let formData = new FormData();
          formData.append("file", file);
          http
            .post("/file/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              setImageFile(res.data.filename);
            })
            .catch(function (error) {
              console.log(error.response);
            });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                Add Notification
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                fullWidth
                                margin="dense"
                                label="StartDate"
                                name="startDate"
                                value={formik.values.startDate || null}
                                onChange={(date) => formik.setFieldValue('startDate', date)}
                                onBlur={() => formik.setFieldTouched('startDate', true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        margin="dense"
                                        helperText={formik.touched.startDate && formik.errors.startDate}
                                        fullWidth
                                        value={formatDate(formik.values.startDate)}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                fullWidth
                                margin="dense"
                                label="EndDate"
                                name="endDate"
                                value={formik.values.endDate || null}
                                onChange={(date) => formik.setFieldValue('endDate', date)}
                                onBlur={() => formik.setFieldTouched('endDate', true)}
                                textField={(props) => (
                                    <TextField
                                        {...props}
                                        variant="standard"
                                        margin="dense"
                                        helperText={formik.touched.endDate && formik.errors.endDate}
                                        fullWidth
                                        value={formatDate(formik.values.endDate)}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                 onChange={onFileChange} />
                            </Button>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="notification"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddNotification;