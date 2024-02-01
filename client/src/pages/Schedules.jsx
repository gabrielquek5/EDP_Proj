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
import global from "../global";

function Schedules() {
  const [scheduleList, setScheduleList] = useState([]);
  const [search, setSearch] = useState("");

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getSchedules = () => {
    http.get("/schedule").then((res) => {
      setScheduleList(res.data);
    });
  };

  const searchSchedules = () => {
    http.get(`/schedule?search=${search}`).then((res) => {
      setScheduleList(res.data);
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
      <Typography variant="h5" sx={{ my: 2 }}>
        Events
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
        {scheduleList.map((schedule, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={schedule.id}>
              <Link to={`/viewevent/${schedule.id}`} style={{ textDecoration: "none" }}>
                <Card>
                  {schedule.imageFile && (
                    <Box className="image-size">
                      <img
                        alt="tutorial"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${schedule.imageFile}`}
                      ></img>
                    </Box>
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {schedule.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccountCircle sx={{ mr: 1 }} />
                      <Typography>{schedule.user?.name}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }} color="text.secondary" >
                      <DateRangeOutlined sx={{ mr: 1 }} />
                      <Typography>Start Date: </Typography>
                      <Typography>
                        {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
                      </Typography>
                    </Box>

                    {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }} color="text.secondary" >
                      <TimerOutlined sx={{ mr: 1 }} />
                      <Typography>Start Time: </Typography>
                      <Typography>
                        {dayjs(schedule.selectedTime).format("HH:mm")}
                      </Typography>
                    </Box> */}

                    {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }} color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(schedule.createdAt).format(
                          global.datetimeFormat
                        )}
                      </Typography>
                    </Box> */}

                    {/* <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      <Typography>Description: </Typography>
                      {schedule.description}
                    </Typography> */}
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Schedules;
