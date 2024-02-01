import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
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
        .required("Password is required"),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http
        .post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          toast.success(`User Login successfull!`);
          setUser(res.data.user);
          navigate("/");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    }
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
        border: "1px solid #FFA500",
        borderRadius: "16px",
        padding: "5px",
        width: "50%",
        height: "50%",
        marginLeft: "25%",
        minHeight: "50vh",
      }}
    >
      <Typography variant="h5" sx={{ my: 2, fontFamily: "cursive" }}>
        Login
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: "12px",
            backgroundColor: "#FFA500",
            fontFamily: "cursive",
          }}
          type="submit"
        >
          Login
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
