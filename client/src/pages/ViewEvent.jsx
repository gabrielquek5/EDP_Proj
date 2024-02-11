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
import { Box, Typography, Button, Autocomplete, TextField,List, ListItem,Rating, Card, CardContent, Grid, IconButton,  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions } from "@mui/material";
  import FlagIcon from '@mui/icons-material/Flag';
import axios from "axios";
import { right } from "@popperjs/core";

function ViewEvent() {
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false); 
  const [dialogId, setDialogId] = useState(null);
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({
    title: "",
    description: "",
    dates: "",
    times: "",
    postalCode: "",
  });

  const reportReview = (dialogId) => {
    if (!dialogId) {
      console.error('No review ID provided',dialogId);
      return;
    }
    console.log(dialogId)

    http.put(`/reviews/${dialogId}/report-review`)
      .then((res) => {
        console.log("Review reported successfully:", dialogId);
        handleClose();
      })
      .catch((error) => {
        console.error('Error reporting review:', error);
        handleClose();
      });
  };

  const handleOpen = (dialogId) => {
    setOpen(true);
    setDialogId(dialogId);
    console.log("dialogId",dialogId)
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [reviews, setReviews] = useState([]);
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
    http.get(`/reviews/${id}/schedules`).then((res) => {
      setReviews(res.data);
      console.log("review data", reviews)
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
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <div>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt:12, mb:2, fontFamily:"Poppins" }}>
                  {schedule.title}
                </Typography>
            <Typography
              variant="h7"
              sx={{ my: 2, textDecoration: "underline", fontFamily:"Poppins" }}
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
                  sx={{ fontWeight: "bold" }}
                >
                  Event Information:
                </Typography>
                            <Typography sx={{fontFamily:"Poppins",}}>
              Date: {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
            </Typography>
            <Typography sx={{fontFamily:"Poppins",}}>
              Time: {dayjs(schedule.selectedTime).format("h:mm A")}{" "}
            </Typography>
            <Typography sx={{fontFamily:"Poppins",}}>Price: ${schedule.price}</Typography>

            <Typography sx={{ my: 1 }}></Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold",fontFamily:"Poppins",}}
            >
              Description:
            </Typography>
            <Typography sx={{fontFamily:"Poppins",}}>{schedule.description}</Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    my: 2,
                    fontWeight: "bold",
                    fontFamily:"Poppins",
                  }}
                >
                  Reviews:
                </Typography>
                {reviews.length === 0 ? (
                  <Typography sx={{fontFamily:"Poppins",}}>No reviews found for this event.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {reviews.map((review) => (
                      <Grid item xs={12} key={review.reviewID}>
                        <Card variant="outlined">
                          <CardContent>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
  {review.firstname} {review.lastname}
</Typography>

                            <Rating precision={0.1} value={review.rating} readOnly />
                            <Typography>{review.comments}</Typography>
                            <IconButton onClick={() => handleOpen(review.reviewID)}> {/* Open the dialog on icon click */}
               <FlagIcon />
              </IconButton>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                    ))
                    
                    
                    }
                  </Grid>
                )}
              </div>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ marginTop: '150px' }}>
              {user && (
                <form onSubmit={formik.handleSubmit}>
                  
                  <Box sx={{ my: 2, boxShadow: 3, p: 2, borderRadius: 2,  alignItems: 'center' }}>
                  <Card sx={{border: "1px solid #e3e3e3", borderRadius:"12px", maxWidth: "200px", margin: "auto"}}>
                  <Box sx={{bgcolor:"#e8533f", height: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Typography sx={{fontFamily:"Poppins", color:"white", fontWeight: "bold"}}>YOUR PRICE</Typography>
                  </Box>
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Typography variant="h5" sx={{ fontFamily:"Poppins", fontWeight:"bold", color:"#e8533f", fontSize:"34px" }}>
                        ${schedule.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                  <Box sx={{ my: 4 }}>
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
                        formik.setFieldValue(
                          "Quantity",
                          newValue?.id || null
                        );
                        setQuantity(newValue?.id);
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("Quantity", true)
                      }
                      slotProps={{
                        textField: {
                          error:
                            formik.touched.Quantity &&
                            Boolean(formik.errors.Quantity),
                          helperText:
                            formik.touched.Quantity &&
                            formik.errors.Quantity,
                        },
                      }}
                      sx={{ width: 300, fontFamily:"Poppins" }}
                      renderInput={(params) => (
                        <TextField
                        
                          {...params}
                          label="Quantity"
                          error={
                            formik.touched.Quantity &&
                            Boolean(formik.errors.Quantity)
                          }
                          helperText={
                            formik.touched.Quantity &&
                            formik.errors.Quantity
                          }
                        />

                        
                      )}
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <Box sx={{ width: "100%" }}>
                      <DatePicker
                        label="Please Choose A Date"
                        value={formik.values.cartSelectedDate}
                        minDate={dayjs(schedule.selectedDate)}
                        onChange={(newDate) =>
                          formik.setFieldValue(
                            "cartSelectedDate",
                            newDate
                          )
                        }
                        slotProps={{
                          textField: {
                            error:
                              formik.touched.cartSelectedDate &&
                              Boolean(formik.errors.cartSelectedDate),
                            helperText:
                              formik.touched.cartSelectedDate &&
                              formik.errors.cartSelectedDate,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 4, width: "100%" }}>
                      <TimePicker
                        label="Please Choose A Time"
                        value={formik.values.cartSelectedTime}
                        onChange={(newTime) =>
                          formik.setFieldValue(
                            "cartSelectedTime",
                            newTime
                          )
                        }
                        slotProps={{
                          textField: {
                            error:
                              formik.touched.cartSelectedTime &&
                              Boolean(formik.errors.cartSelectedTime),
                            helperText:
                              formik.touched.cartSelectedTime &&
                              formik.errors.cartSelectedTime,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center'  }}>
                    <Button type="submit" variant="contained" sx={{bgcolor:"#e8533f", fontWeight:"bold", fontFamily:"Poppins"}}>
                      Add to Cart
                    </Button>
                  </Box>
                  </Box>
                </form>
              )}
              {!user && (
                <Box sx={{ mt: 3 }}>
                  <Link to="/login">
                    <Typography style={{ fontFamily: "Poppins" }}>
                      Please Login to add event to cart.
                    </Typography>
                  </Link>
                </Box>
              )}
              </div>
            </Grid>
          </Grid>
        )}
                          {/* Cancel Booking Dialog */}
                          <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Report Review</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to report this review?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              No
            </Button>
            <Button variant="contained" color="error" onClick={() => reportReview(dialogId)}>
  Yes
</Button>

          </DialogActions>
        </Dialog>
    </UserContext.Provider>
    </LocalizationProvider>
    
  );
}

export default ViewEvent;
