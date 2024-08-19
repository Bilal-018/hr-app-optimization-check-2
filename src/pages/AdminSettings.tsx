import { Box, Typography } from '@mui/material';

import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AdminSettingsSubMenu from '../components/AdminSettings/SubMenu';
import { useTranslation } from 'react-i18next';

export const ActiveMenuStyles = (theme: any) => ({
  backgroundColor: theme.palette.background.lightBack,
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  filter: 'saturation(100%)',
});

export const SUB_MENU = {
  employeeInfo: 'Employees Information',

  leaveManagent: 'Leave Management',
  // announcement: 'Announcements Management',
  // asset: 'Assets Management',
};

const PROFILE_OPTIONS = [
  {
    name: SUB_MENU.employeeInfo,
    icon: PersonIcon,
  },
  {
    name: SUB_MENU.leaveManagent,
    icon: TodayIcon,
  },
  // {
  //   name: SUB_MENU.announcement,
  //   icon: InfoIcon,
  // },
  // {
  //   name: SUB_MENU.asset,
  //   icon: PhoneIphoneIcon,
  // },
];

function AdminSettingsOptions() {
  const [activeMenu, setActiveMenu] = useState<any>(SUB_MENU.employeeInfo);

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        // border: '1px solid rgba(9, 44, 76, 0.1)',
        // borderRadius: '20px',
        p: '10px',
        mt: '5px',

        '@media (max-width: 600px)': {
          p: '10px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '10px',

          '@media (max-width: 850px)': {
            flexDirection: 'column',
            gap: '10px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',

            '@media (max-width: 600px)': {
              gap: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
            },
          }}
        >
          {PROFILE_OPTIONS.map((option: any) => (
            <Box
              key={option.name}
              sx={(theme) => ({
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
                padding: '0 10px',
                border: '1px solid transparent',
                borderRadius: '40px',
                cursor: 'pointer',
                position: 'relative',
                height: "32px",
                '& img': {
                  filter: 'saturation(0%)',
                },

                ...(option.name === activeMenu && {
                  ...ActiveMenuStyles(theme),
                }),

                '&:hover': {
                  ...{
                    ...ActiveMenuStyles(theme),
                  },
                },
              })}
              onClick={() => { setActiveMenu(option.name) }}
            >
              <option.icon style={{width: 20}}/>

              <Typography style={{fontSize: 14}}>{t(option.name)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <AdminSettingsSubMenu activeMenu={activeMenu} />
    </Box>
  );
}

function AdminSettings() {
  return (
    <Box
      sx={{
        p: '20px',

        '@media (max-width: 600px)': {
          p: '10px',
        },
      }}
    >
      <AdminSettingsOptions />
    </Box>
  );
}

export default AdminSettings;
