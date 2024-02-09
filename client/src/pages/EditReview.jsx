import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Rating, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function EditReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Review, setReview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [picture, setpicture] = useState(null);
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        http.get(`/reviews/${id}`).then((res) => {
            console.log("res.data",res.data)
            setReview(res.data);
            setBookingId(res.data.bookingId);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: { Rating: Review.rating, Comments: Review.comments },
        enableReinitialize: true,

        validationSchema: yup.object({
            Rating: yup.number().required('Rating is required'),
            Comments: yup.string().trim()
                .min(5, 'Review must be at least 5 characters long')
                .max(200, 'Review must be less than 200 characters long')
        }),

        

        onSubmit: async (data) => {
            try {
                console.log("submitted", data);
                if (picture) {
                    data.picture = picture;
                }
                await http.put(`/reviews/${id}`, data);
                navigate("/reviews");
            } catch (error) {
                console.error("Error updating review:", error);
            }
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

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteReview = async () => {
        try {
            await http.delete(`/reviews/${id}`);
            await http.put(`/bookings/${bookingId}/remove-review`)
            navigate("/reviews");
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 5, mt: 2, fontWeight: 'bold' }}>
                Edit Review
            </Typography>
            {!loading && (
                <Box sx={{ mr: 15 }} component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
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

                        <Grid item xs={6}>
                            <Box>
                                <Rating
                                    name="Rating"
                                    sx={{mr:100, mt:0.5}}
                                    value={Number(formik.values.Rating)}  // Ensure Rating receives a number
                                    precision={0.5}
                                    onChange={(event, newValue) => formik.setFieldValue('Rating', newValue)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Rating && Boolean(formik.errors.Rating)}
                                    helperText={formik.touched.Rating && formik.errors.Rating}
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 8 }}
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
                    </Grid>

                    <Box mt={4} ml={15}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ ml: 2 }}
                            color="error"
                            onClick={handleOpen}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteReview}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditReview;
