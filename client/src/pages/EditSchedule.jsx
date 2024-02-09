import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";
import UserContext from "../contexts/UserContext";

dayjs.extend(utc);
dayjs.extend(timezone);

function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [schedule, setSchedule] = useState({
    title: "",
    description: "",
    selectedDate: null,
    selectedTime: null,
    postalCode: "",
    eventType: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postalCode, setPostalCode] = useState("");
  const [location, setLocation] = useState(null);
  const [eventType, seteventType] = useState("");

  const [initialPrice, setInitialPrice] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearchLocation = async (postalCode) => {
    if (postalCode.length >= 6) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&region=SG&key=AIzaSyA3dZPJdXKjR22pktSERq2kfFWrOuP-78I`
        );

        if (response.data.results.length > 0) {
          const addressComponents = response.data.results[0].address_components;
          const blockComponent = addressComponents.find((component) =>
            component.types.includes("street_number")
          );
          const neighborhoodComponent = addressComponents.find((component) =>
            component.types.includes("neighborhood")
          );

          if (neighborhoodComponent && neighborhoodComponent.long_name) {
            const last3DigitsOfPostalCode = postalCode.slice(-3);
            const formattedAddress =
              neighborhoodComponent.long_name +
              `, Block${last3DigitsOfPostalCode} ` +
              `, SG${postalCode}`;

            setLocation({ formattedAddress });
          } else {
            setLocation(null);
            toast.error("Invalid neighborhood for the given postal code");
          }
        } else {
          setLocation(null);
          toast.error("Location not found for the given postal code");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocation(null);
        toast.error("Error fetching location. Please try again.");
      }
    } else {
      setLocation(null);
    }
  };

  const options = [
    { label: "Sports", id: "Sports" },
    { label: "Gathering", id: "Gathering" },
    { label: "Dine & Wine", id: "Dine & Wine" },
    { label: "Family Bonding", id: "Family Bonding" },
    { label: "Hobbies & Wellness", id: "Hobbies & Wellness" },
    { label: "Travel", id: "Travel" },
    { label: "Others", id: "Others" },
  ];

  const formik = useFormik({
    initialValues: schedule,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup
        .string()
        .trim()
        .min(6, "Title must be at least 6 characters")
        .max(100, "Title must be at most 100 characters")
        .required("Title is required"),
      description: yup
        .string()
        .trim()
        .min(6, "Description must be at least 6 characters")
        .max(100, "Description must be at most 100 characters")
        .required("Description is required"),
      postalCode: yup
        .string()
        .trim()
        .min(6, "Postal code must be 6 digits!")
        .max(6, "Postal code must be 6 digits only!")
        .required("Description is required"),
      eventType: yup.string().required("Event Type is required"),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }

      data.title = data.title.trim();
      data.description = data.description.trim();
      data.postalCode = data.postalCode.trim();

      const selectedDateTime = dayjs.tz(
        `${data.selectedDate.format("YYYY-MM-DD")} ${data.selectedTime.format(
          "HH:mm:ss"
        )}`,
        "Asia/Singapore"
      );

      data.selectedDate = selectedDateTime.format();
      data.selectedTime = selectedDateTime.format();

      data.price = initialPrice;

      http.put(`/schedule/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/schedules");
      });
    },
  });

  useEffect(() => {
    if (user && schedule.userId && user.id !== schedule.userId) {
      navigate("/schedules");
    }
  }, [user, schedule]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const softdeleteSchedule = () => {
    http.put(`/schedule/${id}/request-delete`).then((res) => {
      navigate("/schedules");
    });
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  const fetchScheduleData = async () => {
    try {
      const res = await http.get(`/schedule/${id}`);
      const scheduleData = res.data;

      var eventTypeUpdated = "";

      if (scheduleData.eventType == "Family & Bonding") {
        eventTypeUpdated = "Family Bonding";
      } else {
        eventTypeUpdated = scheduleData.eventType;
      }

      formik.setValues({
        title: scheduleData.title,
        description: scheduleData.description,
        selectedDate: dayjs(scheduleData.selectedDate),
        selectedTime: dayjs(scheduleData.selectedTime),
        postalCode: scheduleData.postalCode,
        eventType: eventTypeUpdated,
      });

      setInitialPrice(scheduleData.price);
      setImageFile(scheduleData.imageFile);
      setLoading(false);

      if (!user || (scheduleData.userId && user.id !== scheduleData.userId)) {
        navigate("/schedules");
      }
    } catch (error) {
      console.error("Error fetching schedule data", error);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [user, id, schedule]);

  useEffect(() => {
    if (user && schedule.userId && user.id !== schedule.userId) {
      navigate("/schedules");
    }
  }, [user, schedule]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          Edit Schedule
        </Typography>
        {!loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={8}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  multiline
                  minRows={2}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <DatePicker
                    label="Please Choose A Date"
                    value={formik.values.selectedDate}
                    minDate={dayjs()}
                    onChange={(newDate) =>
                      formik.setFieldValue("selectedDate", newDate)
                    }
                    error={
                      formik.touched.selectedDate &&
                      Boolean(formik.errors.selectedDate)
                    }
                    helperText={
                      formik.touched.selectedDate && formik.errors.selectedDate
                    }
                    slotProps={{
                      textField: {
                        disabled: true,
                      },
                    }}
                    timezone="Asia/Singapore"
                    required
                    sx={{ width: "50%" }}
                  />
                  <TimePicker
                    label="Please Choose A Time"
                    value={formik.values.selectedTime}
                    onChange={(newTime) =>
                      formik.setFieldValue("selectedTime", newTime)
                    }
                    error={
                      formik.touched.selectedTime &&
                      Boolean(formik.errors.selectedTime)
                    }
                    helperText={
                      formik.touched.selectedTime && formik.errors.selectedTime
                    }
                    slotProps={{
                      textField: {
                        disabled: true,
                      },
                    }}
                    timezone="Asia/Singapore"
                    required
                    sx={{ width: "50%" }}
                  />
                </Box>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Postal Code"
                  name="postalCode"
                  value={formik.values.postalCode}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleSearchLocation(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.postalCode &&
                    Boolean(formik.errors.postalCode)
                  }
                  helperText={
                    formik.touched.postalCode && formik.errors.postalCode
                  }
                />
                {location && (
                  <div>
                    <h3>Location Details</h3>
                    <p>{location.formattedAddress}</p>
                  </div>
                )}
                {options && (
                  <Box>
                    <InputLabel id="event-type-label">Event Type</InputLabel>
                    <Select
                      labelId="event-type-label"
                      id="event-type"
                      name="eventType"
                      value={formik.values.eventType || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.eventType &&
                        Boolean(formik.errors.eventType)
                      }
                    >
                      {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      variant: "contained",
                      textDecoration: "none",
                      color: "black",
                      bgcolor: "#e81515",
                      "&:hover": {
                        color: "#ffffff",
                        bgcolor: "#e81515",
                      },
                      boxShadow: "none",
                      borderRadius: 4,
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingX: "50px",
                      paddingY: "10px",
                    }}
                  >
                    Upload Image
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={onFileChange}
                    />
                  </Button>
                  {imageFile && (
                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                      <img
                        alt="tutorial"
                        src={`${
                          import.meta.env.VITE_FILE_BASE_URL
                        }${imageFile}`}
                      ></img>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
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
                  paddingX: "50px",
                  paddingY: "10px",
                  margin: 10,
                }}
                type="submit"
              >
                Update
              </Button>
              <Button
                sx={{
                  variant: "contained",
                  textDecoration: "none",
                  color: "black",
                  bgcolor: "#e81515",
                  "&:hover": {
                    color: "#ffffff",
                    bgcolor: "#e81515",
                  },
                  boxShadow: "none",
                  borderRadius: 4,
                  fontWeight: "bold",
                  paddingX: "50px",
                  paddingY: "10px",
                  margin: 10,
                }}
                onClick={handleOpen}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Schedule</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to request deletion for this schedule?
            </DialogContentText>
            <Box sx={{ m: 2 }}></Box>
            <Typography>
              You will{" "}
              <Typography sx={{ color: "red", fontWeight: "bold" }}>
                NOT
              </Typography>{" "}
              be able to edit this event!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={softdeleteSchedule}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Box>
    </LocalizationProvider>
  );
}

export default EditSchedule;
