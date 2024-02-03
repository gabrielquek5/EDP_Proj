import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
} from "@mui/material";
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

function IndividualSchedules() {
  const [scheduleList, setScheduleList] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getSchedules = async () => {
    try {
      const res = await http.get("/schedule");
      const filteredSchedules = res.data.filter((schedule) => !schedule.isDeleted);
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

  useEffect(() => {
    getSchedules();
  }, []);

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

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          my: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Your Schedules
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
          border: "1px solid #e3e3e3",
          borderRadius: 8,
          width: "fit-content",
          paddingX: "20px",
          paddingY: "10px",
          margin: "20px auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
          <Input
            value={search}
            placeholder="Enter keyword"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            disableUnderline
          />

          <IconButton
            onClick={onClickSearch}
            sx={{
              left: "5px",
              border: "1px solid #e8533f",
              color: "#ffffff",
              padding: "10px",
              borderRadius: 8,
              fontSize: "2px",
              bgcolor: "#e8533f",
              "&:hover": {
                color: "black",
                bgcolor: "#e8533f",
              },
            }}
          >
            <Search />
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontSize: "18px",
                paddingLeft: "10dp",
                color: "inherit",
              }}
            >
              Search
            </Typography>
          </IconButton>

          <IconButton
            color="primary"
            onClick={onClickClear}
            sx={{
              left: "7px",
              color: "black",
              marginLeft: "10px",
              border: "1px solid #ebebeb",
              background: "#ebebeb",
              padding: "5px",
            }}
          >
            <Clear />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
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
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {schedule.title}
                      </Typography>
                      {user && user.id === schedule.userId && (
                        <Link to={`/editschedule/${schedule.scheduleId}`}>
                          <Button
                            variant="contained"
                            sx={{
                              textDecoration: "none",
                              color: "#ffffff",
                              bgcolor: "#ed7565",
                              "&:hover": {
                                color: "#ffffff",
                                bgcolor: "#ed7565",
                                boxShadow: "none",
                                fontWeight: "bold",
                              },
                              boxShadow: "none",
                              borderRadius: 4,
                              fontWeight: "bold",
                              fontSize: "12px"
                            }}>
                            Edit
                          </Button>
                        </Link>
                      )}
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccountCircle sx={{ mr: 1 }} />
                      <Typography>{schedule.user?.firstName}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <DateRangeOutlined sx={{ mr: 1 }} />
                      <Typography>Start Date: </Typography>
                      <Typography>
                        {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>Created Date: </Typography>
                      <Typography>
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
                      <Typography>Updated Date: </Typography>
                      <Typography>
                        {dayjs(schedule.updateAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}

export default IndividualSchedules;
