import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function EditBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState({
        BookingDate: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/bookings/${id}`).then((res) => {
            setBooking(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: { BookingDate: booking.BookingDate },
        enableReinitialize: true,
        validationSchema: yup.object({
            BookingDate: yup.date().required('Date is required'),
        }),
        onSubmit: (data) => {
            console.log("submitted", data);
            // Ensure that the date is sent in the correct format
            data.BookingDate = data.BookingDate.format('YYYY-MM-DDTHH:mm:ss');
            
            http.put(`/bookings/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/bookings");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteBooking = () => {
        http.delete(`/bookings/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/bookings");
            });
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Reschedule Booking
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    
                        
                    
                    <Box sx={{ mt: 2 }}>
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
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteBooking}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
        </LocalizationProvider>
    );
}

export default EditBooking;
