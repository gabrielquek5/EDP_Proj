import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
} from "@mui/material";
import { DateRangeOutlined } from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchComponent from "./Components/SearchComponent";
import UserContext from "../contexts/UserContext";

function Schedules() {
  const [scheduleList, setScheduleList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getSchedules = () => {
    http.get("/schedule").then((res) => {
      const filteredSchedules = res.data.filter(
        (schedule) => !schedule.isDeleted && !schedule.isCompleted
      );
      setScheduleList(filteredSchedules);
    });
  };

  const searchSchedules = () => {
    http.get(`/schedule?search=${search}`).then((res) => {
      const filteredSchedules = res.data.filter(
        (schedule) =>
          !schedule.isDeleted &&
          !schedule.isCompleted &&
          schedule.eventType.toLowerCase().includes(selectedEventType)
      );
      setScheduleList(filteredSchedules);
    });
  };

  useEffect(() => {
    getSchedules();
    http.get(`/reviews`).then((res) => {
      setReviews(res.data);
    });
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
  const eventTypes = [
    { label: "All", id: "" },
    { label: "Sports", id: "sport" },
    { label: "Gathering", id: "gathering" },
    { label: "Dine & Wine", id: "dine & wine" },
    { label: "Family Bonding", id: "family & bonding" },
    { label: "Hobbies & Wellness", id: "hobbies & wellness" },
    { label: "Travel", id: "Travel" },
    { label: "Others", id: "Others" },
  ];

  const handleEventTypeClick = (eventType) => {
    const formattedEventType = eventType.toLowerCase().replace(/\s+/g, "");

    setSelectedEventType(formattedEventType);

    if (formattedEventType === "") {
      // If All is selected, fetch all schedules
      getSchedules();
    } else {
      // Fetch schedules based on the selected event type
      http.get(`/schedule?search=${formattedEventType}`).then((res) => {
        const filteredSchedules = res.data.filter(
          (schedule) => !schedule.isDeleted
        );
        setScheduleList(filteredSchedules);
      });
    }
  };

  return (
    <Box>
      <SearchComponent
        search={search}
        onSearchChange={onSearchChange}
        onSearchKeyDown={onSearchKeyDown}
        onClickSearch={onClickSearch}
        onClickClear={onClickClear}
      />

      <Box
        sx={{ display: "flex", justifyContent: "center", gap: "10px", mb: 4 }}
      >
        {eventTypes.map((eventType) => (
          <Button
            key={eventType.id}
            onClick={() => handleEventTypeClick(eventType.id)}
            sx={{
              border: "1px solid #fddc02",
              color: selectedEventType === eventType.id ? "#ffffff" : "black",
              paddingLeft: 3,
              paddingRight: 3,
              fontFamily:"Poppins",
              textTransform: "none",
              marginTop:"20px",
              bgcolor:
                selectedEventType === eventType.id ? "#e81515" : "#fddc02",
              "&:hover": {
                color: selectedEventType === eventType.id ? "#ffffff" : "#e81515",
                bgcolor:
                  selectedEventType === eventType.id ? "#e81515" : "#fddc02",
              },
              fontWeight: "bold",
              borderRadius: 8,
            }}
          >
            {eventType.label}
          </Button>
        ))}
      </Box>
            {scheduleList.length === 0 ? (
              <>
    <Typography
      variant="h6"
      sx={{ textAlign: "center", fontFamily: "Poppins", mt: 4 }}
    >
      There are no events currently available.
    </Typography>
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
            mt:3,
            fontFamily:"Poppins",
            bgcolor: "#fddc02",
            "&:hover": {
              color: "#e8533f",
              bgcolor: "#fddc02",
            },
            boxShadow: "none",
            borderRadius: 1,
            border:" 1px solid black",
            fontWeight: "bold",
          }}
        >
          Add New Event Here
        </Button>
      </Link>
    )}
  </Box>
  </>
  ) : (
      <Grid container spacing={2}>
        {scheduleList.map((schedule, i) => {
          const scheduleReviews = reviews.filter(
            (review) => review.scheduleId === schedule.scheduleId
          );

          // Calculate average rating
          const totalRatings = scheduleReviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const averageRating =
            scheduleReviews.length > 0
              ? totalRatings / scheduleReviews.length.toFixed(1)
              : 0;
          const reviewText =
            scheduleReviews.length === 1 ? "review" : "reviews";

          return (
            <Grid item xs={12} md={6} lg={4} key={schedule.scheduleId}>
              <Link
                to={`/viewevent/${schedule.scheduleId}`}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{border: "1px solid #e3e3e3", borderRadius:"12px"}}>
                  {schedule.imageFile && (
                    <Box className="image-size">
                      <img
                        alt="event_image"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          schedule.imageFile
                        }`}
                      ></img>
                    </Box>
                  )}

                  <CardContent sx={{ position: "relative" }}>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontFamily:"Poppins",fontWeight:"bold" }}>
                        {schedule.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 2.5 }}
                      
                    >
                      <DateRangeOutlined sx={{ mr: 1 }} />
                      <Typography sx={{ fontSize: "16px", marginRight:"5px" }}>
                        Starts:{" "}
                      </Typography>
                      <Typography sx={{  fontSize:"16px", fontFamily:"Poppins" }}>
                        {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      
                    >
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <Typography sx={{ fontSize: "16px", marginRight:"5px", fontFamily:"Poppins" }}>
                        Location:{" "}
                      </Typography>
                      <Typography sx={{  fontSize:"16px", fontFamily:"Poppins" }}>
                        {schedule.postalCode}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      
                    ><Typography sx={{ mr: 1, mt: 0.5, fontSize: "1.2rem", color:"grey" }}>
                    {averageRating}
                  </Typography>
                      <Rating precision={0.1} value={averageRating} readOnly size="medium" />
                      
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        ({scheduleReviews.length} {reviewText})
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 6 }}></Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      
                    >
                      <Typography sx={{marginTop:"5px", marginRight:"5px", fontFamily:"Poppins"}}>From </Typography>
                      <Typography sx={{ fontWeight: "bold", fontSize: "25px", fontFamily:"Poppins" }}>
                        ${schedule.price}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        border: "1px solid #f5f5f5",
                        backgroundColor: "#f5f5f5",
                        color: "#999898",
                        padding: "8px",
                        borderRadius: 2,
                        margin: 3,
                        fontSize: "5px",
                      }}
                    >
                      <Typography sx={{fontFamily:"Poppins", color:"grey"}}>{schedule.eventType}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    )}
    </Box>
  );
}

export default Schedules;
