import { Box } from "@mui/material";
import React from "react";
import { Containers } from "./containers/Containers";
import { Header } from "./Header";
import { Plants } from "./plants/Plants";

export const Home = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "center", width: "100%" }}>
      <Header />
      <Plants />
      <Containers />
    </Box>
  );
};
