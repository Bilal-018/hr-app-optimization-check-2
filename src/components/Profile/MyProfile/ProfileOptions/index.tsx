import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  AssetsIcon,
  BankIcon,
  DocumentIcon,
  PayrollIcon,
  ProfileSubMenuIcon,
} from '../../../../assets/images';
import SubmitMenu from './SubMenu';
import { useTranslation } from 'react-i18next';
import { ActiveMenuStyles } from '../../../../pages/AdminSettings';

export const SUB_MENU = {
  profile: 'Profile',
  bankAccount: 'Bank Account',
  documents: 'Documents',
  assets: 'Assets',
  payroll: 'Payroll',
};

const PROFILE_OPTIONS = [
  {
    name: SUB_MENU.profile,
    icon: ProfileSubMenuIcon,
  },
  {
    name: SUB_MENU.payroll,
    icon: PayrollIcon,
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
  const [activeMenu, setActiveMenu] = useState<any>(SUB_MENU.profile);
  const { t } = useTranslation();

  return (
    <Box boxShadow={'4px 4px 16px rgba(9, 44, 76, 0.10),-4px -4px 16px rgba(9, 44, 76, 0.10)'} borderRadius={3}
      sx={{
        p: '15px',
        mt: '15px',

        '@media (max-width: 600px)': {
          p: '10px',
          maxWidth: '85vw',
        },

        '@media (max-width: 425px)': {
          p: '10px',
          maxWidth: '78vw',
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
            gap: '5px',
            flexWrap: 'wrap',

            '@media (max-width: 600px)': {
              gap: '10px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          {PROFILE_OPTIONS.map((option) => (
            <Box
              key={option.name}
              sx={(theme) => ({
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
                padding: '8px 15px',
                border: '1px solid transparent',
                borderRadius: '40px',
                cursor: 'pointer',
                position: 'relative',

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
              <img
                src={option.icon}
                alt={option.name}
                width='15px'
                height='15px'
              />
              <Typography fontSize='14px' fontWeight={500} lineHeight='normal'>{t(option.name)}</Typography>
            </Box>
          ))}
        </Box>
        {/* <SearchBar
          variant="outlined"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#F7F8FB",
            color: "#092C4C",

            "& svg > path": {
              fill: "#092C4C",
              opacity: 0.5,
            },
          }}
        /> */}
      </Box>
      <SubmitMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default ProfileOptions;
