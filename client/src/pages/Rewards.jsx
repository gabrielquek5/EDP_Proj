import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Rewards() {
    const [rewardList, setRewardList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

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

    const handleRedeem = (reward) => {
        setSelectedReward(reward);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedReward(null);
        setSuccessMessage("");
    };

    const confirmRedeem = () => {
        // Add logic for redeeming the reward
        // You can call an API or perform any action here

        // Display success message in Dialog
        setSuccessMessage(`Congratulations! You have redeemed ${selectedReward.title} and been added to cart.`);

        setOpen(false);
        setSelectedReward(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Rewards
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
                            <Button variant='contained'>
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
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {reward.user?.name}
                                            </Typography>
                                        </Box>
                                        {/* Remove date and time display */}
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {reward.description}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {reward.duration}
                                        </Typography>
                                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                                            <Button variant="outlined" color="primary" sx={{ color: 'green' }} onClick={() => handleRedeem(reward)}>
                                                Redeem
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>

            {/* Redeem Confirmation Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Confirm Redemption
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to redeem {selectedReward?.title}?
                    </DialogContentText>
                    <DialogContentText>
                        The reward will expire after {selectedReward?.duration}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="primary" onClick={confirmRedeem}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={!!successMessage} onClose={() => setSuccessMessage("")}>
                <DialogTitle>
                    Redemption Successful
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {successMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={() => setSuccessMessage("")}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Rewards;
