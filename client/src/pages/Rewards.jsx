import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Rewards() {
    const [rewardList, setRewardList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRewards = () => {
        http.get('/reward').then((res) => {
            setRewardList(res.data);
        });
    };

    const searchRewards = () => {
        http.get(`/reward?search=${search}`).then((res) => {
            setRewardList(res.data);
        });
    };

    useEffect(() => {
        getRewards();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };

    const onClickSearch = () => {
        searchRewards();
    }

    const onClickClear = () => {
        setSearch('');
        getRewards();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, textAlign: 'center' , fontFamily:"Poppins" }}>
                Add Rewards
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
                {
                    user && (
                        <Link to="/addreward" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' sx={{ fontFamily:"Poppins"}}>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    rewardList.map((reward, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={reward.id}>
                                <Card>
                                    {
                                        reward.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="reward"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 , fontFamily:"Poppins" }}>
                                            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily:"Poppins" }}>
                                                {reward.title}
                                            </Typography>
                                            {
                                                user && user.id === reward.userId && (
                                                    <Link to={`/editreward/${reward.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap', fontFamily:"Poppins" }}>
                                            {reward.description}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap', fontFamily:"Poppins" }}>
                                            {reward.duration}
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

export default Rewards;
