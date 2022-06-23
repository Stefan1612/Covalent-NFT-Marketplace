import React from "react";
import { Box, Button, Input, Typography, Container } from "@mui/material";
const Transfers = ({ account }) => {
  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Container>
        <Box
          sx={{
            color: "white",
            borderColor: "white",
            border: "solid",
            borderWidth: "1px",
            marginBottom: "10vh",
          }}
        >
          {" "}
          <Box>
            Currently Connected With: {account ? account : "Not Connected"}
          </Box>
          Current Ethereum Balance:
        </Box>{" "}
        <Box
          style={{
            border: "solid",
            /* margin: "10px", */
            padding: "10px",
            paddingLeft: "30px",
            borderWidth: "1px",
            textAlign: "left",
            backgroundColor: "white",
          }}
        >
          {" "}
          Transfers
        </Box>
      </Container>
    </Box>
  );
};

export default Transfers;
