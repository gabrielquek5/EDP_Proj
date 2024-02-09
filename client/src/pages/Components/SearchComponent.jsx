import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Input,
  IconButton,
} from "@mui/material";
import {
  Search,
  Clear,
} from "@mui/icons-material";
function SearchComponent({ search, onSearchChange, onSearchKeyDown, onClickSearch, onClickClear,}) 
{
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 2,
        border: "1px solid #e3e3e3",
        borderRadius: 8,
        width: "fit-content",
        paddingX: "20px",
        paddingY: "10px",
        margin: "20px auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
        <Input
          value={search}
          placeholder="Enter keyword"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          disableUnderline
        />

        <IconButton
          onClick={onClickSearch}
          sx={{
            left: "5px",
            border: "1px solid #e8533f",
            color: "#ffffff",
            padding: "10px",
            borderRadius: 8,
            fontSize: "2px",
            bgcolor: "#e8533f",
            "&:hover": {
              color: "black",
              bgcolor: "#e8533f",
            },
          }}
        >
          <Search />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: "18px",
              paddingLeft: "10dp",
              color: "inherit",
            }}
          >
            Search
          </Typography>
        </IconButton>

        <IconButton
          color="primary"
          onClick={onClickClear}
          sx={{
            left: "7px",
            color: "black",
            marginLeft: "10px",
            border: "1px solid #ebebeb",
            background: "#ebebeb",
            padding: "5px",
          }}
        >
          <Clear />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
}

export default SearchComponent;