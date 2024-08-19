import { Box, Stack, Typography, alpha } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import CircularIcon from "../Global/CircularIcon";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";

function FavouriteFeatures(): JSX.Element {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        borderRadius: "20px",
        background: "#FFF",
        p: "15px",
      }}
    >
      <Typography className="bodyBold" mb={2}>
        {t("Favourite features")}
      </Typography>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Stack
            direction="row"
            mt={2}
            key={index}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              ...(index !== 2 && {
                borderBottom: `1px solid ${alpha("#092C4C", 0.1)}`,
              }),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              flex={0.7}
              justifyContent="space-between"
              sx={{
                ...(index !== 2 && {
                  pb: 1,
                }),
              }}
            >
              <StarIcon sx={{ color: "#FFC107" }} />
              <CircularIcon icon={<PersonIcon />} color="#092C4C" />
              <Typography variant="body2">{t("Job Vacancies")}</Typography>
            </Stack>
            <MoreVertIcon />
          </Stack>
        ))}
    </Box>
  );
}

export default FavouriteFeatures;
