import {React, useEffect, useState } from "react";
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
import { AccessTime, Search, Clear } from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useParams, useNavigate, Link } from "react-router-dom";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";

function Bookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("active");

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

  const getBookings = () => {
    http.get("/bookings").then((res) => {
      const bookings = res.data;
      setBookingsList(bookings);
      console.log("bookings data",bookings)

      const activeBookingsFiltered = bookings.filter((booking) => booking.isCancelled !== true);
        
      setActiveBookings(activeBookingsFiltered);
    //   setActiveBookings(bookings.filter(booking => booking.isCancelled !== true));
      console.log("Active bookings after update:", activeBookingsFiltered);
    
      const cancelledBookingsFiltered = bookings.filter((booking) => booking.isCancelled === true)

    //   setActiveBookings(bookings.filter((booking) => !booking.isCancelled));
    setCancelledBookings(cancelledBookingsFiltered);
      console.log("Cancelled bookings after update:", cancelledBookingsFiltered);

    });
  };


  useEffect(() => {
    getBookings();
  }, []);

  const cancelBooking = () => {
    http.put(`/bookings/${id}`)
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
    return bookings.filter((booking) => booking.isCancelled === (currentTab === "cancelled"));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        My Bookings
      </Typography>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
        <Tab label="Active Bookings" value="active" />
        <Tab label="Cancelled Bookings" value="cancelled" />
      </Tabs>

      {/* Search Box */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt:3 }}>
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
        {filterBookings(currentTab === "active" ? activeBookings : cancelledBookings).length === 0 ? (
          <Typography mt={5} fontFamily={'Poppins'} variant="body1">You currently do not have any {currentTab === "active" ? "active" : "cancelled"} bookings.</Typography>
        ) : (
          filterBookings(currentTab === "active" ? activeBookings : cancelledBookings).map((booking) => (
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
                      {dayjs(booking.bookingDate).format(global.datetimeFormat)}
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