import { Box, Typography } from '@mui/material';

import React, { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HRDashboardSubMenu from '../components/HrDashboard/SubMenu';
import { useTranslation } from 'react-i18next';
import { ActiveMenuStyles } from './AdminSettings';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import InfoIcon from '@mui/icons-material/Info';

export const SUB_MENU = {
  dashboard: 'Dashboard',
  announcement: 'Announcements Management',
  payslip: 'Payslip',
  employeeInfo: 'Employee Information',
  assets: 'Assets',
  employeeDocuments: 'Employee Documents',
  leaveManagement: 'Leave Management',
 
  skillManagement: 'Skills Management',
 
};

const PROFILE_OPTIONS = [
  {
    name: SUB_MENU.dashboard,
    icon: DashboardIcon,
  },
  {
    name: SUB_MENU.announcement,
    icon: InfoIcon,
  },
  {
    name: SUB_MENU.payslip,
    icon: PaymentIcon,
  },
  {
    name: SUB_MENU.employeeInfo,
    icon: PersonIcon,
  },
  {
    name: SUB_MENU.leaveManagement,
    icon: ManageAccountsIcon,
  },
  {
    name: SUB_MENU.skillManagement,
    icon: ManageAccountsIcon,
  },
 
   {
    name: SUB_MENU.assets,
    icon: PhoneIphoneIcon,
  },
  /*{
    name: SUB_MENU.assets,
    icon: PermDeviceInformationIcon,
  },
  {
    name: SUB_MENU.employeeDocuments,
    icon: DescriptionIcon,
  },*/
 
 
];

function HrDashboardOptions() {
  const [activeMenu, setActiveMenu] = useState<any>(SUB_MENU.dashboard);
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        // border: '1px solid rgba(9, 44, 76, 0.1)',
        borderRadius: '20px',
        p: '15px',
        mt: '15px',

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
      <HRDashboardSubMenu activeMenu={activeMenu} />
    </Box>
  );
}

function HrDashboard() {
  return (
    <Box
      sx={{
        p: '20px',

        '@media (max-width: 600px)': {
          p: '10px',
        },
      }}
    >
      <HrDashboardOptions />
    </Box>
  );
}

export default HrDashboard;
