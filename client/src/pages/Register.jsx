import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


function Register() {
    const navigate = useNavigate();
const formik = useFormik({
  initialValues: {
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  validationSchema: yup.object({
    FirstName: yup
      .string()
      .trim()
      .min(2, "Name must be at least 3 characters")
      .max(30, "Name must be at most 50 characters")
      .required("Please enter your first name.")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Only allow letters, spaces and characters: ' - , ."
      ),
      LastName: yup
      .string()
      .trim()
      .min(2, "Name must be at least 3 characters")
      .max(30, "Name must be at most 50 characters")
      .required("Please enter your last name.")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Only allow letters, spaces and characters: ' - , ."
      ),
      PhoneNumber: yup
      .string()
      .trim()
      .min(8, "Your mobile number should have 8 digits")
      .max(8, "Your mobile number should have 8 digits")
      .required("Please enter your mobile phone number.")
      .matches(/^[89]\d{7}$/, 'Your mobile phone should only contain numbers'
      ),
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .max(50, "Email must be at most 50 characters")
      .required("Email is required"),
    password: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "At least 1 letter and 1 number"
      ),
    confirmPassword: yup
      .string()
      .trim()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),
  onSubmit: (data) => {
    data.FirstName = data.FirstName.trim();
    data.LastName = data.LastName.trim();
    data.PhoneNumber = data.PhoneNumber.trim();
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();
    http
      .post("/user/register", data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
        console.log(err.response);
      });
  },
});
return (
  <Box
    component="Box"
    sx={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: '1px solid #FFA500',
      borderRadius: '16px',
      padding: '16px',
      width: '50%',
      height: '50%',
      marginLeft: '25%',
      minHeight: '70vh'
    }}
  >
    <legend>
        <Typography variant="h5" sx={{ my: 2, fontFamily:"cursive" }}>
        Register
        </Typography>
    </legend>
    <Box
      component="form"
      sx={{ maxWidth: "500px" }}
      onSubmit={formik.handleSubmit}
    >
    <Box sx={{ display: 'flex', gap: 2 }}>   
      <TextField
        sx={{ flex: 0.5, marginRight: '8px', width: '50%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="First Name"
        name="FirstName"
        value={formik.values.FirstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
        helperText={formik.touched.FirstName && formik.errors.FirstName}
        
      />
      <TextField
      sx={{ flex: 0.5, marginRight: '8px', width: '50%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Last Name"
        name="LastName"
        value={formik.values.LastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.LastName && Boolean(formik.errors.LastName)}
        helperText={formik.touched.LastName && formik.errors.LastName}
        
      />
      </Box> 
      <TextField
        sx={{ flex: 0.5, marginRight: '8px', width: '99%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Phone Number"
        name="PhoneNumber"
        value={formik.values.PhoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.PhoneNumber && Boolean(formik.errors.PhoneNumber)}
        helperText={formik.touched.PhoneNumber && formik.errors.PhoneNumber}
      />
      <TextField
      sx={{ flex: 0.5, marginRight: '8px', width: '99%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
       sx={{ flex: 0.5, marginRight: '8px', width: '99%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Password"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <TextField
        sx={{ flex: 0.5, marginRight: '8px', width: '99%' }}
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2, borderRadius: '12px', backgroundColor: '#FFA500', fontFamily:"cursive" }} type="submit">
        Register
      </Button>
    </Box>
    <ToastContainer />
  </Box>
);
}

export default Register
