import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import dayjs from "dayjs";
import http from "../http";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie
} from "recharts";
import UserContext from "../contexts/UserContext";
import SearchComponent from "./Components/SearchComponent";

function AdminPanel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [openEvent, setEventOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showEventTable, setShowEventTable] = useState(false);
  const [showBookingsTable, setShowBookingsTable] = useState(false);
  const [searchSche, setSearchSche] = useState("");
  const [searchBook, setSearchBook] = useState("");
  const [sortByDeleteStatus, setSortByDeleteStatus] = useState(false);
  const [sortByCancelledStatus, setSortByCancelledStatus] = useState(false);

  const getAllEvents = () => {
    http
      .get("/adminschedule")
      .then((res) => {
        const sortedScheduleList = res.data.sort((a, b) =>
          a.scheduleId > b.scheduleId ? 1 : -1
        );
        setScheduleList(sortedScheduleList);
        console.log(sortedScheduleList);
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error);
      });
  };

  const getAllBookings = () => {
    http
      .get("/bookings")
      .then((res) => {
        const sortedBookingList = res.data.sort((a, b) =>
          a.bookingID > b.bookingID ? 1 : -1
        );
        setBookingsList(sortedBookingList);
        console.log(sortedBookingList);
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error);
      });
  };

  useEffect(() => {
    getAllEvents();
    getAllBookings();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/schedules");
    }
  }, [user]);

  const countEventsByType = () => {
    const eventCounts = {};

    scheduleList.forEach((schedule) => {
      const eventType = schedule.eventType;
      if (eventCounts[eventType]) {
        eventCounts[eventType]++;
      } else {
        eventCounts[eventType] = 1;
      }
    });

    return eventCounts;
  };

  const countBookingsByType = () => {
    const bookingsCounts = {};

    bookingsList.forEach((booking) => {
      const bookingType = booking.eventType;
      if (bookingsCounts[bookingType]) {
        bookingsCounts[bookingType]++;
      } else {
        bookingsCounts[bookingType] = 1;
      }
    });

    return bookingsCounts;
  };

  const prepareChartData = () => {
    const eventCounts = countEventsByType();
    return Object.keys(eventCounts).map((eventType) => ({
      eventType,
      count: eventCounts[eventType],
    }));
  };

  const prepareBookingChartData = () => {
    const bookingCounts = countBookingsByType();
    return Object.keys(bookingCounts).map((bookingType) => ({
      bookingType,
      count: bookingCounts[bookingType],
    }));
  }

  const handleEventDeletionOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setEventOpen(true);
  };

  const handleEventDeletionClose = () => {
    setEventOpen(false);
  };

  const softdeleteSchedule = (id) => {
    http.put(`/schedule/${id}/soft-delete`).then((res) => {
      getAllEvents();
      setEventOpen(false);
    });
  };

  const rejectdeleteSchedule = (id) => {
    http.put(`/schedule/${id}/reject-soft-delete`).then((res) => {
      getAllEvents();
      setEventOpen(false);
    });
  };

  const handleShowEventTable = () => {
    setShowEventTable(!showEventTable);
  };

  const handleShowBookingTable = () => {
    setShowBookingsTable(!showBookingsTable);
  }

  const searchSchedules = () => {
    http.get(`/adminschedule?search=${searchSche}`).then((res) => {
      const filteredSchedules = res.data;
      setScheduleList(filteredSchedules);
    });
  };

  const searchBookings = () => {
    http.get(`/bookings?search=${searchBookings}`).then((res) => {
      const filteredSchedules = res.data;
      setScheduleList(filteredSchedules);
    });
  };

  const onSearchChangeBookings = (e) => {
    setSearchBook(e.target.value);
  };

  const onSearchKeyDownBookings = (e) => {
    if (e.key === "Enter") {
      searchSchedules();
    }
  };

  const onClickSearchBookings = () => {
    searchSchedules();
  };

  const onClickClearBookings = () => {
    setSearchBook("");
    getAllBookings();
  };

  const onSearchKeyDownSchedules = (e) => {
    if (e.key === "Enter") {
      searchSchedules();
    }
  };

  const onClickSearchSchedules = () => {
    searchSchedules();
  };

  const onClickClearSchedules = () => {
    setSearchSche("");
    getAllEvents();
  };

  const toggleSortByDeleteStatus = () => {
    setSortByDeleteStatus(!sortByDeleteStatus);
  };

  const onSearchChangeSchedules = (e) => {
    setSearchSche(e.target.value);
  };

  const toggleSortByCancelledStatus = () => {
    setSortByCancelledStatus(!sortByCancelledStatus);
  };

  const sortedScheduleList = sortByDeleteStatus
    ? [
        ...scheduleList.filter((schedule) => schedule.requestDelete),
        ...scheduleList.filter((schedule) => !schedule.requestDelete),
      ]
    : [...scheduleList];

    const sortedBookingList = sortByCancelledStatus
    ? [
        ...bookingsList.filter((booking) => booking.isCancelled),
        ...bookingsList.filter((booking) => !booking.isCancelled),
      ]
    : [...bookingsList];

  const handleRedirectToAdminReviews = () => {
    navigate("/adminreviews");
  };

  return (
    <Box>
      <Button
        onClick={handleShowEventTable}
        sx={{
          variant: "contained",
          textDecoration: "none",
          background: "#fddc02",
          color: "black",
          bgcolor: "#fddc02",
          "&:hover": {
            color: "#e8533f",
            bgcolor: "#fddc02",
          },
          boxShadow: "none",
          borderRadius: 4,
          fontWeight: "bold",
          paddingX: "20px",
        }}
      >
        Toggle Event Details
      </Button>

      <Button
        onClick={handleShowBookingTable}
        sx={{
          ml:10,
          variant: "contained",
          textDecoration: "none",
          background: "#fddc02",
          color: "black",
          bgcolor: "#fddc02",
          "&:hover": {
            color: "#e8533f",
            bgcolor: "#fddc02",
          },
          boxShadow: "none",
          borderRadius: 4,
          fontWeight: "bold",
          paddingX: "20px",
        }}
      >
        Toggle Booking Details
      </Button>

      <Button
        onClick={handleRedirectToAdminReviews}
        sx={{
          ml: 10,
          variant: "contained",
          textDecoration: "none",
          background: "#fddc02",
          color: "black",
          bgcolor: "#fddc02",
          "&:hover": {
            color: "#e8533f",
            bgcolor: "#fddc02",
          },
          boxShadow: "none",
          borderRadius: 4,
          fontWeight: "bold",
          paddingX: "20px",
        }}
      >
        View Reported Reviews
      </Button>

      {showEventTable && (
        <>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 2,
            }}
          >
            Event Schedules
          </Typography>
          <SearchComponent
            search={searchSche}
            onSearchChange={onSearchChangeSchedules}
            onSearchKeyDown={onSearchKeyDownSchedules}
            onClickSearch={onClickSearchSchedules}
            onClickClear={onClickClearSchedules}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event ID</TableCell>
                  <TableCell>Event Title</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Event Price</TableCell>
                  <TableCell>Host</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Event Status</TableCell>
                  <TableCell
                    onClick={toggleSortByDeleteStatus}
                    style={{ cursor: "pointer" }}
                  >
                    Deleted/Request {sortByDeleteStatus ? "▲" : "▼"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedScheduleList.map((schedule) => (
                  <TableRow key={schedule.scheduleId}>
                    <TableCell>{schedule.scheduleId}</TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>{schedule.eventType}</TableCell>
                    <TableCell>${schedule.price}.00</TableCell>
                    <TableCell>{schedule.user.firstName}</TableCell>
                    <TableCell>
                      {dayjs(schedule.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>

                    <TableCell>
                      {schedule.isCompleted && !schedule.isDeleted
                        ? "Ended"
                        : !schedule.isCompleted && !schedule.isDeleted
                        ? "Ongoing"
                        : schedule.isCompleted && schedule.isDeleted
                        ? "Ended/Deleted"
                        : "Deleted"}
                    </TableCell>
                    <TableCell>
                      {schedule.requestDelete ? (
                        schedule.isDeleted ? (
                          schedule.isDeleted.toString()
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleEventDeletionOpen(schedule)}
                          >
                            Deletion Request
                          </Button>
                        )
                      ) : (
                        schedule.isDeleted.toString()
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            style={{
              height: 400,
              display: "flex",
              marginTop: 4,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                my: 2,
              }}
            >
              Event Distribution
            </Typography>
            <BarChart width={600} height={360} data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="eventType"
                angle={-10}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis interval={1} />
              <Tooltip />
              <Legend wrapperStyle={{ display: "none", marginTop: "150px" }} />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </Box>
        </>
      )}

{/* Bookings Table and graph */}

{showBookingsTable && (
        <>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 2,
            }}
          >
            All Bookings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell >Booking ID</TableCell>
                  <TableCell>Booking Title</TableCell>
                  <TableCell>Booking Date and Time</TableCell>
                  <TableCell>Booking Pax</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Booking Status</TableCell>
                  <TableCell
                    onClick={toggleSortByCancelledStatus}
                    style={{ cursor: "pointer" }}
                  >
                    Cancelled {sortByCancelledStatus ? "▲" : "▼"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBookingList.map((booking) => (
                  <TableRow key={booking.bookingID}>
                    <TableCell >{booking.bookingID}</TableCell>
                    <TableCell>{booking.bookingTitle}</TableCell>
                    <TableCell>{booking.bookingTime}</TableCell>
                    <TableCell>{booking.pax}</TableCell>
                    <TableCell>
                      {dayjs(booking.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>

                    <TableCell>
                      {booking.isCompleted && !schedule.isCancelled
                        ? "Completed"
                        : !booking.isCompleted && !booking.isCancelled
                        ? "Active"
                        : !booking.isCompleted && booking.isCancelled
                        ? "Cancelled"
                        : "Deleted"}
                    </TableCell>
                    <TableCell>{booking.isCancelled}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            style={{
              height: 400,
              display: "flex",
              marginTop: 4,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
  variant="h5"
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    my: 2,
  }}
>
  Booking Distribution
</Typography>
<PieChart width={600} height={360}>
  <Pie
    data={prepareBookingChartData}
    dataKey="count"
    nameKey="bookingType"
    cx="50%"
    cy="50%"
    outerRadius={100}
    fill="#8884d8"
    label
  />
  <Tooltip />
  <Legend />
</PieChart>
          </Box>
        </>
      )}



      <Dialog open={openEvent} onClose={handleEventDeletionClose}>
        <DialogTitle>Delete Schedule</DialogTitle>
        {selectedSchedule && (
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this schedule "
              {selectedSchedule.title}"?
            </DialogContentText>
            <Typography>User: {selectedSchedule.user.firstName}</Typography>
            <Typography>Title: {selectedSchedule.title}</Typography>
            <Typography>Price: ${selectedSchedule.price}.00</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleEventDeletionClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => rejectdeleteSchedule(selectedSchedule.scheduleId)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => softdeleteSchedule(selectedSchedule.scheduleId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;
