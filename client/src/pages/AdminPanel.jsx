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
import axios from "axios";
import UserContext from "../contexts/UserContext";

function AdminPanel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([]);
  const [openEvent, setEventOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showEventTable, setShowEventTable] = useState(false);

  const getAllEvents = () => {
    http
      .get("/schedule")
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
          <Typography variant="h5" sx={{ my: 2 }}>
            Event Schedules
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event ID</TableCell>
                  <TableCell>Event Title</TableCell>
                  <TableCell>Event Description</TableCell>
                  <TableCell>Event Price</TableCell>
                  <TableCell>Hoster</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Event Status</TableCell>
                  <TableCell>Event Deleted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleList.map((schedule) => (
                  <TableRow key={schedule.scheduleId}>
                    <TableCell>{schedule.scheduleId}</TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>{schedule.description}</TableCell>
                    <TableCell>${schedule.price}.00</TableCell>
                    <TableCell>{schedule.user.firstName}</TableCell>
                    <TableCell>{schedule.updatedAt}</TableCell>
                    <TableCell>
                      {schedule.isCompleted
                        ? "Ended"
                        : schedule.isDeleted
                        ? "Deleted"
                        : "Ongoing"}
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
