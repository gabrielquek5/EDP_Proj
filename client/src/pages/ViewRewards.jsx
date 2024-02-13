import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { AccountCircle, Search, Clear } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const regularRedemptionCodes = ['h3Fg7P', 'K9sE2t', 'R4dM6W', 'x8TjL1', 'A2nQ5k'];
const tenPercentRedemptionCodes = ['G7pQ4f', 'K5mR8n', 'D3sF9k', 'W6tH2r', 'E1jN7L'];

function ViewRewards() {
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
        console.log(rewardList)
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
        let redemptionCode;
        if (selectedReward.title.includes('10%')) {
            redemptionCode = getRandomItem(tenPercentRedemptionCodes);
        } else if (selectedReward.title.includes('5%')) {
            redemptionCode = getRandomItem(regularRedemptionCodes);
        } else {
            redemptionCode = getRandomItem(regularRedemptionCodes.concat(tenPercentRedemptionCodes));
        }

        const updatedRewardList = rewardList.map(item => {
            if (item.id === selectedReward.id) {
                return { ...item, redemptionCode };
            }
            return item;
        });
        setRewardList(updatedRewardList);
        setSuccessMessage(`Congratulations! You have redeemed ${selectedReward.title}. Please copy the code "${selectedReward.code}" and add it to cart to apply the reward.`);

        setOpen(false);
        setSelectedReward(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, textAlign: 'center' , fontFamily:"Poppins"}}>
                Rewards
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
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
                                            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' , fontFamily:"Poppins" }}>
                                                {reward.title}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' , fontFamily:"Poppins" }}>
                                            {reward.description}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' , fontFamily:"Poppins" }}>
                                            Duration: {reward.duration}
                                        </Typography>
                                        {reward.redemptionCode && (
                                            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 2, fontWeight:"bold" , fontFamily:"Poppins" }}>
                                                Your redemption code: {reward.code}
                                            </Typography>
                                        )}
                                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                                            {!reward.redemptionCode && (
                                                <Button variant="outlined" color="primary" sx={{ color: 'green' , fontFamily:"Poppins" }} onClick={() => handleRedeem(reward)}>
                                                    Redeem
                                                </Button>
                                            )}
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
                <DialogTitle >
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

export default ViewRewards;
