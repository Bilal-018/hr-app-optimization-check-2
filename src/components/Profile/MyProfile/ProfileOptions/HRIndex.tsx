import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  AssetsIcon,
  BankIcon,
  DocumentIcon,
  PayrollIcon,
  ProfileSubMenuIcon,
} from "../../../../assets/images";
import HRSubmitMenu from "./HRSubMenu";
import { useTranslation } from "react-i18next";
import { ActiveMenuStyles } from "../../../../pages/AdminSettings";

export const SUB_MENU = {
  payroll: "General Information",
  profile: "Profile",
  bankAccount: "Bank Account",
  documents: "Documents",
  assets: "Assets",
};

const PROFILE_OPTIONS = [
  {
    name: SUB_MENU.payroll,
    icon: PayrollIcon,
  },
  {
    name: SUB_MENU.profile,
    icon: ProfileSubMenuIcon,
  },
  {
    name: SUB_MENU.bankAccount,
    icon: BankIcon,
  },
  {
    name: SUB_MENU.assets,
    icon: AssetsIcon,
  },
  {
    name: SUB_MENU.documents,
    icon: DocumentIcon,
  },
];

function ProfileOptions() {
  const [activeMenu, setActiveMenu] = useState<any>(SUB_MENU.payroll);
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: "15px",

        "@media (max-width: 600px)": {
          p: "10px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // mb: "10px",

          "@media (max-width: 850px)": {
            flexDirection: "column",
            gap: "10px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",

            "@media (max-width: 600px)": {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          {PROFILE_OPTIONS.map((option) => (
            <Box
              key={option.name}
              sx={(theme) => ({
                display: "flex",
                gap: "5px",
                alignItems: "center",
                padding: "8px 16px",
                border: "1px solid transparent",
                borderRadius: "40px",
                cursor: "pointer",
                position: "relative",

                "& img": {
                  filter: "saturation(0%)",
                },

                ...(option.name === activeMenu && {
                  ...ActiveMenuStyles(theme),
                }),

                "&:hover": {
                  ...{
                    ...ActiveMenuStyles(theme),
                  },
                },
              })}
              onClick={() => { setActiveMenu(option.name) }}
            >
              <img
                src={option.icon}
                alt={option.name}
                width="15px"
                height="15px"
              />
              <Typography className="smallBody" fontSize={14} fontWeight={500}>{t(option.name)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <HRSubmitMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default ProfileOptions;
