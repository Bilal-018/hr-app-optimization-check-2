import { Box } from "@mui/material";
import React from "react";
import ProfileInfo from "../../components/Profile/MyProfile/ProfileInfo";
import ProfileOptions from "../../components/Profile/MyProfile/ProfileOptions";

function MyProfile() {
  return (
    <Box
      sx={{
        p: "20px",

        "@media (max-width: 600px)": {
          p: "10px",
        },
      }}
    >
      <ProfileInfo />
      <ProfileOptions />
    </Box>
  );
}

export default MyProfile;
