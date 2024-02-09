import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const imageStyle = {
  width: "100%",
  height: "auto",
  objectFit: "cover",
  border: "2px solid transparent",
  borderRadius: "20px",
  aspectRatio: "768 / 332",
};

function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        transitionTime={300}
        transitionEffect="fade"
        showStatus={false}
      >
        <Box>
          <img
            src="src/Images/uplay-corporate-engagements-banner.jpg"
            alt="Image 1"
            style={imageStyle}
          />
        </Box>
        <Box>
          <img
            src="src/Images/uplay-about-us---banner.jpg"
            alt="Image 2"
            style={imageStyle}
          />
        </Box>
        <Box>
          <img
            src="src/Images/communities-interest-groups-banner.jpg"
            alt="Image 3"
            style={imageStyle}
          />
        </Box>
      </Carousel>
      <Box>
        <Typography
          variant="h5"
          sx={{
            my: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          About Us
        </Typography>
        <Typography
          sx={{
            fontSize: "25px",
            fontStyle: "italic",
          }}
        >
          You Play, We'll Do The Rest
        </Typography>
        <Typography
          sx={{
            fontSize: "15px",
            my: 2,
            color: "#444444",
          }}
        >
          UPlay, powered by NTUC Club, is a phygital (physical + digital)
          concierge of curatorial recreation experiences to enhance the social
          well-being of all workers.{" "}
        </Typography>
        <Typography
          sx={{
            fontSize: "15px",
            my: 2,
            color: "#444444",
          }}
        >
          More than just a booking platform, UPlay aspires to connect people
          from all walks of life, forging new relationships over time as they
          find a common thread through shared interests. Union and companies can
          also join us in creating fun and engaging communities while
          cultivating deep connections and lifelong relationships.
        </Typography>
      </Box>
      <Box>
        <Link to="/schedules" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              textDecoration: "none",
              color: "#ffffff",
              bgcolor: "#e8533f",
              "&:hover": {
                color: "#ffffff",
                bgcolor: "#ed7565",
                boxShadow: "none",
                fontWeight: "bold",
              },
              boxShadow: "none",
              borderRadius: 4,
              fontWeight: "bold",
              fontSize: "18px",
              my: 5,
            }}
          >
            View Our Events
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default HomePage;