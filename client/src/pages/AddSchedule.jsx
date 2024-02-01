import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import FormControl from "@mui/material/FormControl";
import axios from "axios";

function AddSchedule() {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const [postalCode, setPostalCode] = useState("");
  const [location, setLocation] = useState(null);

  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  const handleSearchLocation = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&region=SG&key=AIzaSyA3dZPJdXKjR22pktSERq2kfFWrOuP-78I`
      );

      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;

        // Find components based on type
        const blockComponent = addressComponents.find((component) =>
          component.types.includes("street_number")
        );

        const neighborhoodComponent = addressComponents.find((component) =>
          component.types.includes("neighborhood")
        );

        const last3DigitsOfPostalCode = postalCode.slice(-3);

        const formattedAddress =
          (neighborhoodComponent ? neighborhoodComponent.long_name : "") +
          `, Block${last3DigitsOfPostalCode} ` +
          `, SG${postalCode}`;

        setLocation({ formattedAddress });
      } else {
        setLocation(null);
        toast.error("Location not found for the given postal code");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation(null);
      toast.error("Error fetching location. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      selectedDate: dayjs(),
      selectedTime: dayjs(),
    },
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
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      if (imageFile === null) {
        return;
      }

      data.imageFile = imageFile;
      data.title = data.title.trim();
      data.description = data.description.trim();
      const selectedDateTime = dayjs.tz(
        `${data.selectedDate.format("YYYY-MM-DD")} ${data.selectedTime.format(
          "HH:mm:ss"
        )}`,
        "Asia/Singapore"
      );

      data.selectedDate = selectedDateTime.format();
      data.selectedTime = selectedDateTime.format();

      http.post("/schedule", data).then((res) => {
        console.log(res.data);
        navigate("/schedules");
      });
    },
  });
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Add Schedule
        </Typography>
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
              <DatePicker
                label="Please Choose A Date"
                defaultValue={formik.values.selectedDate}
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
              />
              <TimePicker
                label="Please Choose A Time"
                defaultValue={formik.values.selectedTime}
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
              />
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="postalCode">Postal Code</InputLabel>
                <TextField
                  id="postalCode"
                  name="postalCode"
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                />
              </FormControl>
              <Button variant="contained" onClick={handleSearchLocation}>
                Search Location
              </Button>

              {location && (
                <div>
                  <h3>Location Details</h3>
                  <p>{location.formattedAddress}</p>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={onFileChange}
                  />
                </Button>
                <Typography color="error" sx={{ mt: 1 }}>
                  Image is required
                </Typography>
                {imageFile && (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="uploaded-schedule"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Box>
        </Box>

        <ToastContainer />
      </Box>
    </LocalizationProvider>
  );
}

export default AddSchedule;
