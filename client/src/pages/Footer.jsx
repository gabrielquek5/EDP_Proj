import React from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
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
        }}
      >
        <Typography>Copyright &copy; {new Date().getFullYear()} IT2166 - EDP Uplay </Typography>
        <Typography>All rights reserved.</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
