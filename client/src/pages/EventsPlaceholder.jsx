    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Autocomplete,TextField, } from '@mui/material';
    import { AccessTime, Search, Clear, Edit,  } from '@mui/icons-material';
    import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
    import http from '../http';
    import dayjs from 'dayjs';
    import global from '../global';
    import { useNavigate } from 'react-router-dom';
    import { useFormik } from 'formik';
    import * as yup from 'yup';
    import { DatePicker } from '@mui/x-date-pickers';
    import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
    import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

    function EventsPlaceholder() {
        const navigate = useNavigate();
        const [eventsList, seteventsList] = useState([]);
        const [search, setSearch] = useState('');
        const getEvents = () => {
            http.get('/eventcontrollerplaceholder').then((res) => {
                seteventsList(res.data);
            });
        };
        const onSearchChange = (e) => {
            setSearch(e.target.value);
        };
        useEffect(() => {
            getEvents();
        }, []);

        const searchEvents = () => {
            http.get(`/eventcontrollerplaceholder?search=${search}`).then((res) => {
                seteventsList(res.data);
            });
        };

        const onSearchKeyDown = (e) => {
            if (e.key === "Enter") {
                searchEvents();
            }
        };

        const onClickSearch = () => {
            searchEvents();
        }

        const onClickClear = () => {
            setSearch('');
            getBookings();
        };

            const [quantity, setQuantity] = useState();
        
            const options = [
                { label: '1', id: 1 },
                { label: '2', id: 2 },
                { label: '3', id: 3 },
                { label: '4', id: 4 },
                { label: '5', id: 5 },
                { label: '6', id: 6 },
                { label: '7', id: 7 },
                { label: '8', id: 8 },
                { label: '9', id: 9 },
                { label: '10', id: 10 },
            ];

        const formik = useFormik({
            initialValues: {
                DateCart:"",
                Quantity:""
            },
            validationSchema: yup.object({
                DateCart: yup.string().trim()             
                    .required('Date is required'),
                Quantity: yup.number()
                    .required('Quantity is required')
            }),

            onSubmit: (data) => {
                http.post("/shoppingcart", data)
                    .then((res) => {
                        console.log(res.data);
                        console.log("quantity:", quantity)
                        alert("Succesfully added to cart.")
                        
                    });
            }
        });

    return (
        <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Events
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
                        eventsList.map((events, i) => {
                            
                            return (
                                
                                <Grid item xs={12} md={6} lg={4} key={events.bookingID}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', mb: 1 }}>
                                                
                                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                    {events.eventName }
                                                </Typography>
                                                
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                color="text.primary">
                                                
                                                <Typography>
                                                    {events.eventDescription}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                                ${events.eventPrice}
                                            </Typography>
                                            
                                            <form onSubmit={formik.handleSubmit}>
                                            <Box>
                                            <Box sx={{mt:3}}>
                                            <LocalizationProvider  dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    label="Select New Date"
                                                    name="DateCart"
                                                    value={formik.values.DateCart}
                                                    onChange={(date) => formik.setFieldValue('DateCart', date)}
                                                    onBlur={() => formik.setFieldTouched('DateCart', true)}
                                                    slotProps={{
                                                        textField: {
                                                            error: formik.touched.DateCart && Boolean(formik.errors.DateCart),
                                                            helperText: formik.touched.DateCart && formik.errors.DateCart,
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                            </Box>
                                            <Box sx={{mt:3}}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={options}
                                                value={options.find((option) => option.id === formik.values.Quantity) || null}
                                                onChange={(event, newValue) => {
                                                    formik.setFieldValue('Quantity', newValue?.id || null);
                                                    setQuantity(newValue?.id);
                                                }}
                                                onBlur={() => formik.setFieldTouched('Quantity', true)}
                                                    slotProps={{
                                                        textField: {
                                                            error: formik.touched.Quantity && Boolean(formik.errors.Quantity),
                                                            helperText: formik.touched.Quantity && formik.errors.Quantity,
                                                        },
                                                    }}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Quantity" />}
                                                />
                                            </Box>
                                            <Box sx={{mt:3}}>
                                                <Button type="submit" variant="contained">Add to Cart</Button>
                                            </Box>
                                            </Box>
                                            </form>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </Box>
    )
    }

    export default EventsPlaceholder