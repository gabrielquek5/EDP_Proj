import React from "react";
import {
  Typography,
  Box,
} from "@mui/material";
function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        paddingTop: "3em",
        position: "relative",
        bottom: 0,
        width: "100",
        marginTop: "4em"
      }}
    >
      <hr />
      <Box
        sx={{
          textAlign: "center",
          padding: "20px",
          fontFamily:"Poppins"
        }}
      >
        <Typography fontFamily="Poppins">Copyright &copy; {new Date().getFullYear()} IT2166 - EDP </Typography>
        <Typography fontFamily="Poppins">Credits: <a href="https://www.uplay.com.sg/" target="_blank">Uplay Singapore</a></Typography>
        <Typography fontFamily="Poppins">All rights reserved.</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
