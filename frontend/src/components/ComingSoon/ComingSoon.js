import React from "react";
import ComingSoonComponent from "assets/coming_soon.jpg";
import { Box } from "@mui/material";

function ComingSoon() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        height: "100%",
        "& img": {
          width: "75%",
          height: "80vh",
        },
      }}
    >
      <img src={ComingSoonComponent} alt="Coming Soon" />
    </Box>
  );
}

export default ComingSoon;
