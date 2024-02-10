import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";
import { useFormik } from "formik";
import * as yup from "yup";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Box, Typography, Button, Autocomplete, TextField, } from "@mui/material";
import axios from "axios";

function ViewEvent() {
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({
    title: "",
    description: "",
    dates: "",
    times: "",
    postalCode: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);

  const handleSearchLocation = async (postalCode) => {
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

  useEffect(() => {
    http.get(`/schedule/${id}`).then((res) => {
      setSchedule(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
      handleSearchLocation(res.data.postalCode);
      console.log(res.data);
    });
  }, []);

  const [quantity, setQuantity] = useState();

  const options = [
    { label: "1", id: 1 },
    { label: "2", id: 2 },
    { label: "3", id: 3 },
    { label: "4", id: 4 },
    { label: "5", id: 5 },
    { label: "6", id: 6 },
    { label: "7", id: 7 },
    { label: "8", id: 8 },
    { label: "9", id: 9 },
    { label: "10", id: 10 },
  ];

  const formik = useFormik({
    initialValues: {
      Quantity: "",
      cartSelectedDate: dayjs(),
      cartSelectedTime: dayjs(),
    },
    validationSchema: yup.object({
      Quantity: yup.number().required("Quantity is required"),
      cartSelectedDate: yup.date()
        .min(dayjs(schedule.selectedDate).date(), `Date cannot be before ${dayjs(schedule.selectedDate).format("DD MMMM YYYY")}`)
        .required("Date is required"),

      cartSelectedTime: yup.date()
        // .min(dayjs(schedule.selectedTime).start, `Time cannot be before ${dayjs(schedule.selectedTime).format("h:mm A")}`)
        .required("Time is required"),
    }),

    onSubmit: (data) => {
      console.log("onsubmit called")
      console.log("data.cartSelectedDate:",data.cartSelectedDate)
      const selectedDateTime = dayjs.tz(
        `${data.cartSelectedDate.format("YYYY-MM-DD")} ${data.cartSelectedTime.format(
          "HH:mm:ss"
        )}`,  
        "Asia/Singapore"
      );
      console.log(selectedDateTime)

      data.cartSelectedDate = selectedDateTime.format();
      data.cartSelectedTime = selectedDateTime.format();
          console.log("data",data)
      http.post(`/shoppingcart/${id}`, data)
        .then((res) => {
          console.log(res.data);
          alert("Successfully added to cart.");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          // Provide user feedback about the error
          alert("Failed to add to cart. Please try again.");
        });
    },
    
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <UserContext.Provider value={{ user, setUser }}>
        {!loading && (
          <div>
            <Typography variant="h4" sx={{ my: 2, fontWeight: "bold" }}>
              {schedule.title}
            </Typography>
            <Typography
              variant="h7"
              sx={{ my: 2, textDecoration: "underline" }}
            >
              Event Location:{" "}
              {location ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    location.formattedAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {location.formattedAddress}
                </a>
              ) : (
                schedule.postalCode
              )}
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

            <Typography
              variant="subtitle1"
              sx={{ my: 2, fontWeight: "bold", textDecoration: "underline" }}
            >
              Event Information:
            </Typography>
            <Typography>
              Date: {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
            </Typography>
            <Typography>
              Time: {dayjs(schedule.selectedTime).format("h:mm A")}{" "}
            </Typography>
            <Typography>Price: ${schedule.price}</Typography>

            <Typography sx={{ my: 1 }}></Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Description:
            </Typography>
            <Typography>{schedule.description}</Typography>
            {user && (

              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ my: 2 }}>
                <Autocomplete
  disablePortal
  id="combo-box-demo"
  options={options}
  value={
    options.find(
      (option) => option.id === formik.values.Quantity
    ) || null
  }
  onChange={(event, newValue) => {
    formik.setFieldValue("Quantity", newValue?.id || null);
    setQuantity(newValue?.id);
  }}
  onBlur={() => formik.setFieldTouched("Quantity", true)}
  slotProps={{
    textField: {
      error:
        formik.touched.Quantity && Boolean(formik.errors.Quantity),
      helperText:
        formik.touched.Quantity && formik.errors.Quantity,
    },
  }}
  sx={{ width: 300 }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Quantity"
      error={formik.touched.Quantity && Boolean(formik.errors.Quantity)}
      helperText={formik.touched.Quantity && formik.errors.Quantity}
    />
  )}
/>

                </Box>
<Box sx={{ my: 2 }}>
  {/* DatePicker */}
  <Box sx={{ width: "100%" }}>
    <DatePicker
      label="Please Choose A Date"
      value={formik.values.cartSelectedDate}
      minDate={dayjs(schedule.selectedDate)}
      onChange={(newDate) => formik.setFieldValue("cartSelectedDate", newDate)}
      slotProps={{
        textField: {
          error:
            formik.touched.cartSelectedDate && Boolean(formik.errors.cartSelectedDate),
          helperText:
            formik.touched.cartSelectedDate && formik.errors.cartSelectedDate,
        },
      }}

    />
  </Box>

  {/* TimePicker */}
  <Box sx={{ mt: 2, width: "100%" }}>
    <TimePicker
      label="Please Choose A Time"
      value={formik.values.cartSelectedTime}
      onChange={(newTime) => formik.setFieldValue("cartSelectedTime", newTime)}
      slotProps={{
        textField: {
          error:
            formik.touched.cartSelectedTime && Boolean(formik.errors.cartSelectedTime),
          helperText:
            formik.touched.cartSelectedTime && formik.errors.cartSelectedTime,
        },
      }}

    />
  </Box>
</Box>


                <Box sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained">
                    Add to Cart
                  </Button>
                </Box>
              </form>

            )}
            {!user && (
              <>
                <Box sx={{ mt: 3 }}>
                  <Link to="/login">
                    <Typography style={{ fontFamily: "Poppins" }}>
                      Please Login to add event to cart.
                    </Typography>
                  </Link>
                </Box>
              </>
            )}
          </div>
        )}
    </UserContext.Provider>
    </LocalizationProvider>
  );
}

export default ViewEvent;
