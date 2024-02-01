import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Autocomplete,TextField, } from '@mui/material';

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


  const [quantity, setQuantity] = useState();
        
            const options = [
                { label: '1', id: 1 },
                { label: '2', id: 2 },
                { label: '3', id: 3 },
                { label: '4', id: 4 },
                { label: '5', id: 5 },
                { label: '6', id: 6 },
                { label: '7', id: 7 },
                { label: '8', id: 8 },
                { label: '9', id: 9 },
                { label: '10', id: 10 },
            ];

            const formik = useFormik({
              initialValues: {
                  Quantity:""
              },
              validationSchema: yup.object({
                  Quantity: yup.number()
                      .required('Quantity is required')
              }),
  
              onSubmit: (data) => {
                  http.post(`/shoppingcart/${id}`, data)
                      .then((res) => {
                          console.log(res.data);
                          console.log("quantity:", quantity)
                          alert("Succesfully added to cart.")
                          
                      });
              }
          });

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
                    Event Information:
                  </Typography>
                  <Typography>
                    Date: {dayjs(schedule.selectedDate).format("DD MMMM YYYY")}
                  </Typography>
                  <Typography>
                    Time: {dayjs(schedule.selectedTime).format("h:mm A")}{" "}
                  </Typography>
                  <Typography>
                    Price: ${schedule.price}
                  </Typography>
          
                  <Typography sx={{ my: 1 }}></Typography>
                  <Typography variant="subtitle1" sx={{fontWeight: "bold", textDecoration: "underline"}}>Description:</Typography>
                  <Typography>{schedule.description}</Typography>
                  
                  <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ my: 2 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={options}
                        value={options.find((option) => option.id === formik.values.Quantity) || null}
                        onChange={(schedule, newValue) => {
                          formik.setFieldValue('Quantity', newValue?.id || null);
                          setQuantity(newValue?.id);
                        }}
                        onBlur={() => formik.setFieldTouched('Quantity', true)}
                        slotProps={{
                          textField: {
                            error: formik.touched.Quantity && Boolean(formik.errors.Quantity),
                            helperText: formik.touched.Quantity && formik.errors.Quantity,
                          },
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Quantity" />}
                      />
                    </Box>
                    <Box sx={{mt:3}}>
                      <Button type="submit" variant="contained">Add to Cart</Button>
                    </Box>
                  </form>
                </div>
              )}
            </div>
          );
          
}

export default ViewEvent;