import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Rating, Button, Container  } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccessTime, Search, Clear, Edit,  } from '@mui/icons-material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import '@fontsource/poppins';


function Reviews() {
    const [ReviewsList, setReviewsList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getReviews = () => {
        http.get('/Reviews').then((res) => {
            setReviewsList(res.data);
            console.log(ReviewsList)
        });
    };

    const searchReviews = () => {
        http.get(`/Reviews?search=${search}`).then((res) => {
            setReviewsList(res.data);
        });
    };

    useEffect(() => {
        getReviews();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchReviews();
        }
    };

    const onClickSearch = () => {
        searchReviews();
    }

    const onClickClear = () => {
        setSearch('');
        getReviews();
    };
    
    const theme = createTheme({
        typography: {
          fontFamily: 'poppins'
        },
      });

    return (
        <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" sx={{ my: 2, fontFamily: ['poppins'], textAlign: 'center', flexGrow: 1 }}>
                MY REVIEWS
              </Typography>

              
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt:3 }}>
              <Input
                placeholder="Search"
                onChange={onSearchChange}
                onKeyDown={onSearchKeyDown}
                value={search}
              />
              <IconButton color="primary" onClick={onClickSearch}>
                <Search />
              </IconButton>
              <IconButton color="primary" onClick={onClickClear}>
                <Clear />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
            </Box>
    
            <Grid container spacing={2}>
              {ReviewsList.map((Reviews) => (
                <Grid item xs={12} key={Reviews.reviewID}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box >
                            <Typography variant="h6" sx={{mb:2 }}>{Reviews.eventTitle}</Typography>
                          <Rating defaultValue={Reviews.rating} precision={0.5} readOnly />
                          <Link to={`/editreview/${Reviews.reviewID}`}>
                            <IconButton color="primary" sx={{ padding: '4px', mb: 2}}>
                              <Edit />
                            </IconButton>
                          </Link>
                        </Box>
                        {Reviews.picture && (
                          <Box className="aspect-ratio-container" sx={{ width: '100px', height: '100px', mr: 2 }}>
                            <img
                              alt="review"
                              style={{ width: '120%', height: '120%', objectFit: 'cover' }}
                              src={`${import.meta.env.VITE_FILE_BASE_URL}${Reviews.picture}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Typography variant="body4" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                        {Reviews.comments}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
        </ThemeProvider>
      );
}

export default Reviews;