    import React, { useState, useEffect } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { Box, Typography, TextField, Button, Grid, Rating, IconButton, Card } from '@mui/material';
    import { useFormik } from 'formik';
    import * as yup from 'yup';
    import http from '../http';
    import FileUploadIcon from '@mui/icons-material/FileUpload';

    function AddReview() {
        const navigate = useNavigate();
        const [picture, setpicture] = useState();
        const { id } = useParams();
        const [bookingId, setBookingId] = useState(null);
        const [bookingList, setBookingList] = useState([]);


        useEffect(() => {
            http.get(`/bookings/${id}`).then((res) => {
                console.log("res.data",res.data[0].bookingID)
                setBookingId(res.data[0].bookingID);
                setBookingList(res.data)
            });
        }, [id]);
        

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
            onSubmit: async (data) => {
                if (picture) {
                    data.picture = picture;
                }
                try {
                    await http.put(`/bookings/${bookingId}/has-review`);
                    await http.post(`/reviews/${id}`, data);
                    navigate("/reviews");
                } catch (error) {
                    console.error("Error submitting review:", error);
                }
            }

        });


        return (
            <>
            {bookingList.map((booking) => (
                <Box key={booking.bookingID} sx={{ textAlign: 'center' }}>
                
        
                {/* Header */}
                <Typography variant="h4" sx={{ mb: 5, mt: 2, fontWeight: 'bold' }}>
                    Add Review
                </Typography>
        
                <Box sx={{ mr: 15 }} component="form" onSubmit={formik.handleSubmit}>
                    {/* Grid Container */}
                    <Grid container spacing={2}>

                    <Grid item xs={6} md={4} sx={{ textAlign: 'center' }}>
                    <Box border="1px solid #e8e8e8" padding="5px" borderRadius="12px" boxShadow={2} >
                        {booking && booking.imageFile && (

                            <img
                            alt="event_image"
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${booking.imageFile}`}
                            style={{ width: 'auto', height: 'auto' }}
                            />

                        )}

                    <Typography variant="h6" fontFamily="Poppins" textAlign="center">{booking.eventTitle}</Typography>
                    </Box>
                    </Grid>
                        
                    {/* Labels Group */}
                    <Grid item xs={1.5} sx={{ textAlign: 'right' }}>
                        <Box>
                        <Typography variant="h6" sx={{ mb: 1, fontFamily:"Poppins" }}>
                            Rating
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 1, mt: 8, fontFamily:"Poppins" }}>
                            Comments
                        </Typography>
                        </Box>
                    </Grid>
        
                    {/* Form Fields Group */}
                    <Grid item xs={6.5}>
                        <Box>
                        <Rating
                            sx={{ mr: 100 }}
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
                            sx={{ mt: 8 ,fontFamily:"Poppins"}}
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
                    <Box sx={{ ml: 68 }}>
        
                    </Box>
                    </Grid>
                    {/* Submit Button */}
                    <Box mt={6} ml={1.5}>
                    <Button variant="contained" type="submit" fontFamily="Poppins">
                        Submit
                    </Button>
                    </Box>
                </Box>
                </Box>
            ))}
            </>
        );
        
    }

    export default AddReview;