import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tab,
  Tabs,
  Input
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { AccessTime, Search, Clear } from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";

function Bookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("active");
  const navigate = useNavigate(); // Use useNavigate hook

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleOpen = (id) => {
    setOpen(true);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getBookings = async () => {
    try {
      const res = await http.get("/bookings");
      const bookings = res.data;
  
      const activeBookingsFiltered = [];
      const completedBookingsFiltered = [];
      const cancelledBookingsFiltered = [];
  
      bookings.forEach(booking => {
        const bookingTime = new Date(booking.bookingTime);
        const currentTime = new Date();
  
        if (booking.isCancelled) {
          cancelledBookingsFiltered.push(booking);
        } else if (booking.isCompleted) {
          completedBookingsFiltered.push(booking);
        } else if (bookingTime < currentTime && !booking.isCompleted) {
          booking.isCompleted = true;
          completedBookingsFiltered.push(booking);
          http.put(`/bookings/${booking.bookingID}/complete-booking`)
            .then(response => console.log(`Booking ${booking.bookingID} marked as completed.`))
            .catch(error => console.error(`Error marking booking ${booking.bookingID} as completed:`, error));
        } else {
          activeBookingsFiltered.push(booking);
        }
      });
  
      setActiveBookings(activeBookingsFiltered);
      setCompletedBookings(completedBookingsFiltered);
      setCancelledBookings(cancelledBookingsFiltered);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  
  
  
  
  

  useEffect(() => {
    getBookings();
    console.log(bookingsList);
    console.log(completedBookings)
  }, []);

  const cancelBooking = () => {
    http.put(`/bookings/${id}/cancel-booking`)
      .then((res) => {
        console.log("Booking cancelled successfully:", id);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error cancelling booking:', error);
        handleClose();
      });
  };

  const filterBookings = (bookings) => {
    if (currentTab === "active") return activeBookings;
    if (currentTab === "completed") return completedBookings;
    if (currentTab === "cancelled") return cancelledBookings;
  };

  const handleReview = (bookingID, hasReview) => {
    console.log("View review for booking with ID:", bookingID);
    console.log("Has review:", hasReview);
  
    
    if (hasReview) {
      navigate("/reviews");
    } else {
      navigate(`/AddReview/${bookingID}`);
    }
  };

  return (
    
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        My Bookings
      </Typography>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
        <Tab label="Active Bookings" value="active" fontFamily="Poppins" />
        <Tab label="Completed Bookings" value="completed" fontFamily="Poppins" />
        <Tab label="Cancelled Bookings" value="cancelled" fontFamily="Poppins" />
      </Tabs>

      {/* Search Box */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 3 }}>
        <Search />
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
        />
        <Clear onClick={() => setSearch("")} />
      </Box>

      {/* Bookings */}
      <Grid container spacing={2}>
        {filterBookings().length === 0 ? (
          <Typography mt={5} fontFamily={'Poppins'} variant="body1">You currently do not have any {currentTab === "active" ? "active" : currentTab === "completed" ? "completed" : "cancelled"} bookings.</Typography>
        ) : (
          filterBookings().map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking.bookingID}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {booking.bookingTitle}
                    </Typography>
                    {currentTab === "active" && (
                      <Button
                        variant="contained"
                        sx={{ ml: 2 }}
                        color="error"
                        onClick={() => handleOpen(booking.bookingID)}
                      >
                        Cancel
                      </Button>
                    )}
                    {currentTab === "completed" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReview(booking.bookingID, booking.hasReview)} // Pass a callback function
                        >
                        {booking.hasReview ? "View Review" : "Add Review"}
                      </Button>
                    )}
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.primary"
                  >
                    <PeopleAltIcon sx={{ mr: 1, mt: 0.5 }} />
                    <Typography>Pax: {booking.pax}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.primary"
                  >
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>
                      Date booked:{" "}
                      {dayjs(booking.bookingTime).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {booking.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Cancel Booking Dialog */}
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
          <Button variant="contained" color="error" onClick={cancelBooking}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Bookings;
