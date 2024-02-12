import React, { useState } from "react";
import { Box, Input, IconButton } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
function SearchComponent({
  search,
  onSearchChange,
  onSearchKeyDown,
  onClickSearch,
  onClickClear,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClickSearch = () => {
    setExpanded(true);
    onClickSearch();
  };

  const handleClear = () => {
    onClickClear();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 2,
        border: "1px solid #e3e3e3",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
        width: expanded ? "fit-content" : "10px",
        paddingX: "24px",
        paddingY: "10px",
        margin: "20px auto",
        transition: "width 1s ease",
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
          onClick={handleClickSearch}
          sx={{
            left: expanded ? "5px" : "0px",
            border: "1px solid #e8533f",
            color: "#ffffff",
            padding: "6px",
            borderRadius: 8,
            fontSize: "2px",
            bgcolor: "#e8533f",
            "&:hover": {
              bgcolor: "#e8533f",
            },
          }}
        >
          <Search />
        </IconButton>

        {expanded && (
          <IconButton
            color="primary"
            onClick={handleClear}
            sx={{
              left: "7px",
              color: "black",
              marginLeft: "10px",
              border: "1px solid #ebebeb",
              background: "#ebebeb",
              padding: "1px",
              "& .MuiSvgIcon-root": {
                fontSize: "18px",
              },
            }}
          >
            <Clear />
          </IconButton>
        )}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
}

export default SearchComponent;
