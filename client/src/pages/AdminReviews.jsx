import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Checkbox,
    Input
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Search, Clear } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../http';
import '@fontsource/poppins';

function AdminReviews() {
    const [adminreviewsList, setAdminReviewsList] = useState([]);
    const [search, setSearch] = useState('');
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
    const [individualDelete, setIndividualDelete] = useState(false); // State for individual review deletion

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getAdminReviews = () => {
        http.get('/AdminReviews/reported').then((res) => {
            setAdminReviewsList(res.data);
        });
    };

    useEffect(() => {
        getAdminReviews();
    }, [search]);

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            getAdminReviews();
        }
    };

    const onClickClear = () => {
        setSearch('');
    };

    const handleDone = (id) => {
        http.put(`/AdminReviews/${id}`).then(() => {
            getAdminReviews();
        });
    };

    const handleDelete = (id) => {
        setReviewIdToDelete(id);
        setIndividualDelete(true); // Set to true for individual deletion
        setDeleteDialogOpen(true);
    };

    const handleDeleteReview = () => {
        http.delete(`/AdminReviews/${reviewIdToDelete}`).then(() => {
            setDeleteDialogOpen(false);
            getAdminReviews();
        });
    };

    const handleToggleSelectMode = () => {
        if (isSelecting && selectedReviews.length === 0) {
            setIsSelecting(false);
        } else {
            setIsSelecting(!isSelecting);
        }
    };

    const handleSelectReview = (id) => {
        const selectedIndex = selectedReviews.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedReviews, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedReviews.slice(1));
        } else if (selectedIndex === selectedReviews.length - 1) {
            newSelected = newSelected.concat(selectedReviews.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedReviews.slice(0, selectedIndex),
                selectedReviews.slice(selectedIndex + 1)
            );
        }

        setSelectedReviews(newSelected);
    };

    const isSelected = (id) => selectedReviews.indexOf(id) !== -1;

    const handleClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteSelected = () => {
        setIndividualDelete(false); // Set to false for bulk deletion
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = () => {
        selectedReviews.forEach((id) => {
            http.delete(`/AdminReviews/${id}`).then(() => {
                getAdminReviews();
            });
        });
        setSelectedReviews([]);
        setDeleteDialogOpen(false);
    };

    const handleDeleteIndividual = () => {
        http.delete(`/AdminReviews/${reviewIdToDelete}`).then(() => {
            setDeleteDialogOpen(false);
            getAdminReviews();
        });
    };

    const handleCancelSelection = () => {
        setSelectedReviews([]);
        setIsSelecting(false);
    };

    const theme = createTheme({
        typography: {
            fontFamily: 'poppins'
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h4" sx={{ my: 2, fontFamily: ['poppins'], textAlign: 'center', flexGrow: 1 }}>
                            REPORTED REVIEWS
                        </Typography>
                    </Box>
                    <hr></hr>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                        
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            {isSelecting ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteSelected}
                                        disabled={selectedReviews.length === 0}
                                        style={{ marginRight: '8px' }}
                                    >
                                        Delete Selected
                                    </Button>
                                    <IconButton color="primary" onClick={handleCancelSelection}>
                                        Cancel
                                    </IconButton>
                                </div>
                            ) : (
                                <IconButton color="primary" onClick={handleToggleSelectMode}>
                                    {isSelecting ? 'Cancel' : 'Select'}
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        {adminreviewsList.map((review) => (
                            <Grid item xs={12} key={review.reviewID}>
                                <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Typography variant="h6">{review.eventName}</Typography>
                                            <Typography variant="body1">Rating: {review.rating}</Typography>
                                            <Typography variant="body2">{review.description}</Typography>
                                            <Typography variant="body2">{review.comments}</Typography>
                                        </div>    
                                    </div>
                                    


                                    <div>
                                        {!isSelecting && (
                                            <>
                                                <IconButton color="primary" onClick={() => handleDone(review.reviewID)}>
                                                    <DoneIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDelete(review.reviewID)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        {isSelecting && (
                                            <Checkbox 
                                                checked={isSelected(review.reviewID)}
                                                onChange={() => handleSelectReview(review.reviewID)}
                                            />
                                        )}
                                    </div>
                                    
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {/* Confirmation dialog for delete */}
                <Dialog open={deleteDialogOpen} onClose={handleClose}>
                    <DialogTitle>
                        {individualDelete ? 'Confirm Delete Review' : 'Confirm Delete Selected Reviews'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {individualDelete
                                ? 'Are you sure you want to delete this review?'
                                : 'Are you sure you want to delete the selected reviews?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={individualDelete ? handleDeleteIndividual : handleDeleteConfirmed} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}

export default AdminReviews;
