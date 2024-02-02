import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { AccessTime, Search, Clear, Edit, WindowSharp } from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function Bookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [search, setSearch] = useState("");
  const [id, setid] = useState([]);
  const navigate = useNavigate();


  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setid(id);
  };


  const deleteBooking = () => {
    http.delete(`/bookings/${id}`)
        .then((res) => {
            console.log("THE BOOKING ID IS",id);
            console.log(res.data);
            handleClose();
        })
        .catch((error) => {
            console.error('Error deleting booking:', error);
            handleClose();
        });
}


  const handleClose = () => {
    setOpen(false);
    navigate("/bookings");
  };

  const getBookings = () => {
    http.get("/bookings").then((res) => {
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
  };

  const onClickClear = () => {
    setSearch("");
    getBookings();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        My Bookings
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
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
        {bookingsList.map((bookings, i) => {
          //console.log(bookings);
          return (
            <Grid item xs={12} md={6} lg={4} key={bookings.bookingID}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {bookings.bookingTitle}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      color="error"
                      onClick={() => handleOpen(bookings.bookingID)} // Pass bookingID to handleOpen
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.primary"
                  >
                    <PeopleAltIcon sx={{ mr: 1, mt: 0.5 }} />
                    <Typography>Pax: {bookings.pax}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.primary"
                  >
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>
                      Date booked:{" "}
                      {dayjs(bookings.bookingDate).format(
                        global.datetimeFormat
                      )}
                    </Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {bookings.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
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
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteBooking()}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  );
}

export default Bookings;
