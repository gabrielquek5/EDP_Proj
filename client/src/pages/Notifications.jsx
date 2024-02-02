import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Notifications() {
    const [notificationList, setNotificationList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getNotifications = () => {
        http.get('/notification').then((res) => {
            setNotificationList(res.data);
        });
    };

    const searchNotifications= () => {
        http.get(`/notification?search=${search}`).then((res) => {
            setNotificationList(res.data);
        });
    };

    useEffect(() => {
        getNotifications();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchNotifications();
        }
    };

    const onClickSearch = () => {
        searchNotifications();
    }

    const onClickClear = () => {
        setSearch('');
        getNotifications();
    };

    
    
      

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Notifications
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
                <Link to="/addnotification" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {
                    notificationList.map((notification, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={notification.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {notification.name}
                                            </Typography>
                                            <Link to={`/editnotification/${notification.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(notification.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {notification.description}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {/* Extract only the date part */}
                                        {dayjs(notification.endDate).format('DD-MM-YYYY')}
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

export default Notifications;