import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, FormControlLabel, FormControl, InputLabel, FormHelperText, Select, MenuItem  } from '@mui/material';
import { AccessTime, Search, Clear, Edit,  } from '@mui/icons-material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function Bookings() {
    const [bookingsList, setBookingsList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getBookings = () => {
        http.get('/bookings').then((res) => {
            setBookingsList(res.data);
        });
    };

    const searchBookings = () => {
        http.get(`/bookings?search=${search}`).then((res) => {
            setBookingsList(res.data);
        });
    };

    useEffect(() => {
        getBookings();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBookings();
        }
    };

    const onClickSearch = () => {
        searchBookings();
    }

    const onClickClear = () => {
        setSearch('');
        getBookings();
    };
    
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Bookings
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2}>
                {
                    bookingsList.map((bookings, i) => {
                        console.log(bookings)
                        return (
                            
                            <Grid item xs={12} md={6} lg={4} key={bookings.bookingID}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <PeopleAltIcon sx={{ mr: 1, mt: 0.5 }}/>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                Pax: {bookings.pax }
                                            </Typography>
                                            <Link to={`/editbooking/${bookings.bookingID}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.primary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                Date booked: {dayjs(bookings.bookingDate).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {bookings.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Bookings;