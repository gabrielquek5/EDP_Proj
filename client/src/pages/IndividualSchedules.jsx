import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  AccountCircle,
  AccessTime,
  Search,
  Clear,
  Edit,
  DateRangeOutlined,
  TimerOutlined,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";
import SearchComponent from "./Components/SearchComponent";

function IndividualSchedules() {
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [endEventId, setEndEventId] = useState(null);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getSchedules = async () => {
    try {
      const res = await http.get("/schedule");
      const filteredSchedules = res.data.filter(
        (schedule) => !schedule.isDeleted
      );
      setScheduleList(filteredSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const searchSchedules = () => {
    http.get(`/schedule?search=${search}`).then((res) => {
      const filteredSchedules = res.data.filter(
        (schedule) => !schedule.isDeleted
      );
      setScheduleList(filteredSchedules);
    });
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchSchedules();
    }
  };

  const onClickSearch = () => {
    searchSchedules();
  };

  const onClickClear = () => {
    setSearch("");
    getSchedules();
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const handleEndEventOpen = (id) => {
    setEndEventId(id);
    setOpen(true);
  };

  const handleEndEventClose = () => {
    setOpen(false);
  };

  const endEvent = (id) => {
    http.put(`/schedule/${id}/end-event`).then((res) => {
      navigate("/schedules");
    });
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          my: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily:"Poppins"
        }}
      >
        My Schedules
      </Typography>

      <SearchComponent
        search={search}
        onSearchChange={onSearchChange}
        onSearchKeyDown={onSearchKeyDown}
        onClickSearch={onClickSearch}
        onClickClear={onClickClear}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {user && (
          <Link to="/addschedule" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                textDecoration: "none",
                background: "#fddc02",
                color: "black",
                fontFamily:"Poppins",
                bgcolor: "#fddc02",
                "&:hover": {
                  color: "#e8533f",
                  bgcolor: "#fddc02",
                },
                boxShadow: "none",
                borderRadius: 4,
                fontWeight: "bold",
              }}
            >
              Add New Event
            </Button>
          </Link>
        )}
      </Box>
      <Box sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {scheduleList
          .filter((schedule) => !user || user.id === schedule.userId)
          .map((schedule, i) => {
            const eventStatus = () => {
              if (schedule.isCompleted) {
                if (schedule.requestDelete) {
                  return (
                    <Typography color="error" sx={{ marginX: 1, fontFamily:"Poppins", }}>
                      Completed | Waiting Deletion Approval
                    </Typography>
                  );
                } else {
                  return (
                    <Typography color="error" sx={{ marginX: 1, fontFamily:"Poppins", }}>
                      Completed
                    </Typography>
                  );
                }
              } else {
                if (schedule.requestDelete) {
                  return (
                    <Typography color="primary" sx={{ marginX: 1, fontFamily:"Poppins", }}>
                      Ongoing | Waiting Deletion Approval
                    </Typography>
                  );
                } else {
                  return (
                    <Typography color="primary" sx={{ marginX: 1, fontFamily:"Poppins", }}>
                      Ongoing
                    </Typography>
                  );
                }
              }
            };
            return (
              <Grid item xs={12} md={6} lg={4} key={schedule.id}>
                <Card>
                  {schedule.imageFile && (
                    <Box className="image-size">
                      <img
                        alt="tutorial"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          schedule.imageFile
                        }`}
                      ></img>
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontFamily:"Poppins", }}>
                        {schedule.title}
                      </Typography>
                      {user &&
                        user.id === schedule.userId &&
                        !schedule.isCompleted && !schedule.requestDelete && (
                          <Link to={`/editschedule/${schedule.scheduleId}`}>
                            <Button
                              variant="contained"
                              sx={{
                                textDecoration: "none",
                                color: "#000000",
                                bgcolor: "#fddc02",
                                fontFamily:"Poppins",
                                "&:hover": {
                                  color: "#e8533f",
                                  bgcolor: "#fddc02",
                                  boxShadow: "none",
                                  fontWeight: "bold",
                                },
                                boxShadow: "none",
                                borderRadius: 4,
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        )}
                      <Box sx={{ marginX: 1, fontFamily:"Poppins", }}></Box>
                      {user && user.id === schedule.userId && (
                        <Button
                          variant="contained"
                          sx={{
                            textDecoration: "none",
                            color: "#ffffff",
                            bgcolor: "#ed7565",
                            fontFamily:"Poppins",
                            "&:hover": {
                              color: "#ffffff",
                              bgcolor: "#ed7565",
                              boxShadow: "none",
                              fontWeight: "bold",
                            },
                            boxShadow: "none",
                            borderRadius: 4,
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                          onClick={() =>
                            handleEndEventOpen(schedule.scheduleId)
                          }
                        >
                          End
                        </Button>
                      )}
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1, fontFamily:"Poppins", }}
                      color="text.secondary"
                    >
                      <AccountCircle sx={{ mr: 1, fontFamily:"Poppins", }} />
                      <Typography sx={{fontFamily:"Poppins",}}>{schedule.user?.firstName}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1, fontFamily:"Poppins", }}
                      color="text.secondary"
                    >
                      <DateRangeOutlined sx={{ mr: 1 }} />
                      <Typography sx={{fontFamily:"Poppins",}}>Start Date: </Typography>
                      <Typography sx={{fontFamily:"Poppins",}}>
                        {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography sx={{fontFamily:"Poppins",}}>Created Date: </Typography>
                      <Typography sx={{fontFamily:"Poppins",}}>
                        {dayjs(schedule.createdAt).format(
                          global.datetimeFormat
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography sx={{fontFamily:"Poppins",}}>Updated Date: </Typography>
                      <Typography sx={{fontFamily:"Poppins",}}>
                        {dayjs(schedule.updatedAt).format(
                          global.datetimeFormat
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AutorenewIcon sx={{ mr: 1 }} />
                      <Typography sx={{fontFamily:"Poppins",}}>Event Status: </Typography>
                      {eventStatus()}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      <Dialog open={open} onClose={handleEndEventClose}>
        <DialogTitle sx={{fontFamily:"Poppins",}}>Conclude Event</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{fontFamily:"Poppins",}}>
            Are you sure you want to end this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleEndEventClose}
            sx={{fontFamily:"Poppins",}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => endEvent(endEventId)}
            sx={{fontFamily:"Poppins",}}
          >
            End Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default IndividualSchedules;
