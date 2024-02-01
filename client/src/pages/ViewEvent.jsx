import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

function ViewEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({
    title: "",
    description: "",
    dates: "",
    times: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/schedule/${id}`).then((res) => {
      setSchedule(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
      //   console.log(res.data);
    });
  }, []);

  return (
    <div>
      {!loading && (
        <div>
          <Typography variant="h4" sx={{ my: 2, fontWeight: "bold" }}>
            {schedule.title}
          </Typography>
          <Typography variant="h7" sx={{ my: 2, textDecoration: "underline" }}>
            Event Location: placeholder
          </Typography>

          <Box>
            {imageFile && (
              <Box className="image-size-view" sx={{ mt: 2 }}>
                <img
                  alt="tutorial"
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                ></img>
              </Box>
            )}
          </Box>

          <Typography variant="subtitle1" sx={{ my: 2, fontWeight: "bold", textDecoration: "underline"}}>
            Event Date/Timings:
          </Typography>
          <Typography>
            Date: {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
          </Typography>
          <Typography>
            Time: {dayjs(schedule.selectedTime).format("h:mm A")}{" "}
          </Typography>

          <Typography sx={{ my: 1 }}></Typography>
          <Typography variant="subtitle1" sx={{fontWeight: "bold", textDecoration: "underline"}}>Description:</Typography>
          <Typography>{schedule.description}</Typography>

          <Box sx={{ my: 2 }}>
            <Button variant="contained" type="submit">
              Add to cart
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
}

export default ViewEvent;
