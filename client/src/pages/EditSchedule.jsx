import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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

import UserContext from "../contexts/UserContext";

function EditSchedule() {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [schedule, setSchedule] = useState({
    title: "",
    description: "",
    selectedDate: null,
    selectedTime: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }

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
      http.put(`/schedule/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/schedules");
      });
    },
  });

  useEffect(() => {
    http.get(`/schedule/${id}`).then((res) => {
      console.log(res.data);
      setSchedule(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);

      if (!user || (res.data.userId && user.id !== res.data.userId)) {
        navigate("/schedules");
      }
    });
  }, [user, id]);

  useEffect(() => {
    if (user && schedule.userId && user.id !== schedule.userId) {
      navigate("/schedules");
    }
  }, [user, schedule]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSchedule = () => {
    http.delete(`/schedule/${id}`).then((res) => {
      console.log(res.data);
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

  // Fetch schedule data based on the id
  const fetchScheduleData = async () => {
    try {
      const res = await http.get(`/schedule/${id}`);
      const scheduleData = res.data;

      // Set schedule data as initial values for formik form
      formik.setValues({
        title: scheduleData.title,
        description: scheduleData.description,
        selectedDate: dayjs(scheduleData.selectedDate),
        selectedTime: dayjs(scheduleData.selectedTime),
      });

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
  }, [user, id]);

  useEffect(() => {
    if (user && schedule.userId && user.id !== schedule.userId) {
      navigate("/schedules");
    }
  }, [user, schedule]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
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
                />
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
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                color="error"
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
              Are you sure you want to delete this schedule?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteSchedule}>
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
