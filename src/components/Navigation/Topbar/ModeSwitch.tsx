import styled from '@emotion/styled';
import { Stack, Switch, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../../../theme';

const AntSwitch = styled(Switch)(({ }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        // backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    // transition: theme.transitions.create(['width'], {
    //   duration: 200,
    // }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    // backgroundColor:
    // theme.palette.mode === 'dark'
    //   ? 'rgba(255,255,255,.35)'
    //   : 'rgba(0,0,0,.25)',
    backgroundColor: '#B3B3BF',
    boxSizing: 'border-box',
  },
}));

function ModeSwitch() {
  const { t } = useTranslation();
  const { myTheme, changeTheme }: any = useContext(themeContext);

  return (
    <Stack
      // direction={isTablet ? 'row-reverse' : 'row'}
      display={{ xs:'none', md:'flex' }}
      direction='row'
      spacing={1}
      alignItems='center'
      // justifyContent={isTablet ? 'space-between' : 'flex-start'}
      justifyContent='flex-start'
      // sx={{
      //   ...(isTablet && {
      //     textTransform: 'uppercase',
      //     color: 'primary.main',
      //     fontWeight: 'bold',
      //     p: 1,
      //   }),
      // }}
    >
      <AntSwitch
        checked={myTheme.name === 'dark'}
        inputProps={{ 'aria-label': 'ant design' }}
        sx={{ transform: 'scale(1.2)' }}
        onClick={() =>
          changeTheme(myTheme.name === 'dark' ? 'default' : 'dark')
        }
      />
      <Typography sx={{ fontSize: '14px', fontWeight:500, lineHeight: '17px' }}>{t('Dark Mode')}</Typography>
    </Stack>
  );
}

export default ModeSwitch;
