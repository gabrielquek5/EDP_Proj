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
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
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
} from "recharts";
import UserContext from "../contexts/UserContext";
import SearchComponent from "./Components/SearchComponent";

function AdminPanel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([]);
  const [openEvent, setEventOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showEventTable, setShowEventTable] = useState(false);
  const [searchSche, setSearchSche] = useState("");
  const [sortByDeleteStatus, setSortByDeleteStatus] = useState(false);

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

  useEffect(() => {
    getAllEvents();
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

  const prepareChartData = () => {
    const eventCounts = countEventsByType();
    return Object.keys(eventCounts).map((eventType) => ({
      eventType,
      count: eventCounts[eventType],
    }));
  };

  const handleEventDeletionOpen = (id) => {
    setSelectedSchedule(id);
    console.log(id);
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

  const handleShowEventTable = () => {
    setShowEventTable(!showEventTable);
  };

  const searchSchedules = () => {
    http.get(`/adminschedule?search=${searchSche}`).then((res) => {
      const filteredSchedules = res.data;
      setScheduleList(filteredSchedules);
    });
  };

  const onSearchChangeSchedules = (e) => {
    setSearchSche(e.target.value);
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

  const sortedScheduleList = sortByDeleteStatus
    ? [
        ...scheduleList.filter((schedule) => schedule.requestDelete),
        ...scheduleList.filter((schedule) => !schedule.requestDelete),
      ]
    : [...scheduleList];

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
                  <TableCell>Event Description</TableCell>
                  <TableCell>Event Price</TableCell>
                  <TableCell>Host</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Event Status</TableCell>
                  <TableCell
                    onClick={toggleSortByDeleteStatus}
                    style={{ cursor: "pointer" }}
                  >
                    Event Deleted/Request
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedScheduleList.map((schedule) => (
                  <TableRow key={schedule.scheduleId}>
                    <TableCell>{schedule.scheduleId}</TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>{schedule.description}</TableCell>
                    <TableCell>${schedule.price}.00</TableCell>
                    <TableCell>{schedule.user.firstName}</TableCell>
                    <TableCell>{schedule.updatedAt}</TableCell>
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
                            onClick={() =>
                              handleEventDeletionOpen(schedule.scheduleId)
                            }
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
      <Dialog open={openEvent} onClose={handleEventDeletionClose}>
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedSchedule?.title}?
          </DialogContentText>
        </DialogContent>
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
            color="error"
            onClick={() => softdeleteSchedule(selectedSchedule)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;
