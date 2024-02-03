import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";
import { useFormik } from "formik";
import * as yup from "yup";
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
    },
    validationSchema: yup.object({
      Quantity: yup.number().required("Quantity is required"),
    }),

    onSubmit: (data) => {
      http.post(`/shoppingcart/${id}`, data).then((res) => {
        console.log(res.data);
        console.log("quantity:", quantity);
        alert("Succesfully added to cart.");
      });
    },
  });

  return (
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
                  <Autocomplete disablePortal
                    id="combo-box-demo"
                    options={options}
                    value={
                      options.find(
                        (option) => option.id === formik.values.Quantity
                      ) || null
                    }
                    onChange={(schedule, newValue) => {
                      formik.setFieldValue("Quantity", newValue?.id || null);
                      setQuantity(newValue?.id);
                    }}
                    onBlur={() => formik.setFieldTouched("Quantity", true)}
                    slotProps={{
                      textField: {
                        error:
                          formik.touched.Quantity &&
                          Boolean(formik.errors.Quantity),
                        helperText:
                          formik.touched.Quantity && formik.errors.Quantity,
                      },
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Quantity" />
                    )}
                  />
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
  );
}

export default ViewEvent;
