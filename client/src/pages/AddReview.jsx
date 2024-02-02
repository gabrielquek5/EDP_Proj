import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Rating, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function AddReview() {
    const navigate = useNavigate();
    const [picture, setpicture] = useState(null);


    const formik = useFormik({
        initialValues: {
            Rating: null,
            Comments: ""
        },
        validationSchema: yup.object({
            Rating: yup.number()       
                .required('Rating is required'),
            Comments: yup.string().trim()
                .min(5, 'Review must be at least 5 characters long')
                .max(200, 'Review must be less than 200 characters long')
                .required('Review is required'),

        }),
        onSubmit: (data) => {
            console.log("button clicked")
            if (picture) {
                data.picture = picture;
            }
            http.post("/reviews", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/reviews");
                })
                .catch((error) => {
                    console.error("Error submitting review:", error);
                });
        }

    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setpicture(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };



    return (
        <Box sx={{ textAlign: 'center' }}>
            {/* Header */}
            <Typography variant="h4" sx={{ mb: 5, mt: 2, fontWeight: 'bold' }}>
                Add Review
            </Typography>

            <Box sx={{ mr: 15 }} component="form" onSubmit={formik.handleSubmit}>
                {/* Grid Container */}
                <Grid container spacing={2}>
                    {/* Labels Group */}
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Rating
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 1, mt: 8 }}>
                                Comments
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Form Fields Group */}
                    <Grid item xs={6}>
                        <Box>
                            <Rating
                                sx={{mr:100}}
                                name="Rating"
                                precision={0.5}
                                size="large"
                                value={formik.values.Rating}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Rating && Boolean(formik.errors.Rating)}
                                helperText={formik.touched.Rating && formik.errors.Rating}
                            />
                            <TextField
                                sx={{ mt: 8 }}
                                fullWidth
                                multiline
                                minRows={4}
                                name="Comments"
                                value={formik.values.Comments}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Comments && Boolean(formik.errors.Comments)}
                                helperText={formik.touched.Comments && formik.errors.Comments}
                                placeholder='Write a review'
                            />
                        </Box>
                    </Grid>
                    <Box sx={{ml:68}}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label" startIcon={<FileUploadIcon/>}>
                                
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                                    
                            </Button>
                            {
                                picture && (
                                    <Box className="aspect-ratio-container" sx={{
                                        mt: 2,

                                        
                                    }}>
                                        <img alt="review" style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${picture}`}>
                                        </img>
                                    </Box>
                                )   
                            }
                        </Box>
                    </Grid>
                </Box>
                </Grid>
                {/* Submit Button */}
                <Box mt={6} ml={1.5}>
                <Button variant="contained" type="submit">
                    Submit
                </Button>
                </Box>
            </Box>

            
        </Box>
    );
}

export default AddReview;
