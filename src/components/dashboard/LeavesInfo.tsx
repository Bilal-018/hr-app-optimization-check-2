import { Stack, Typography } from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useTranslation } from "react-i18next";

function LeavesInfo(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" gap={2} my={4} sx={{ display: { xs: 'none', lg: 'flex' }, }}>
      <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
        <CircleIcon color="error" fontSize="inherit" />
        <Typography sx={{ fontSize: 12 }}>{t("Bank Holiday")}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
        <CircleIcon color="success" fontSize="inherit" />
        <Typography sx={{ fontSize: 12 }}>{t("Leaves taken")}</Typography>
      </Stack>
    </Stack>
  );
}

export default LeavesInfo;
