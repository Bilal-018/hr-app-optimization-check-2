import React from 'react';
import { SUB_MENU } from '.';
import Profile from './Profile';
import HRProfile from './HRProfile';
import BankAccount from './BankAccount';
import Documents from './Documents';
import Assets from './Assets';
import { Box } from '@mui/material';

function SubMenu({ activeMenu }: any) {
  switch (activeMenu) {
    // case SUB_MENU.payroll:
    //   return <Profile modal={true} />;
    case SUB_MENU.profile:
      return <HRProfile modal={true} />;
    case SUB_MENU.bankAccount:
      return <BankAccount modal={true} />;
    case SUB_MENU.documents:
      return <Documents modal={true} />;
    case SUB_MENU.assets:
      return <Assets modal={true} />;
    default:
      return <Profile modal={true} />;
  }
}

function HRSubMenu({ activeMenu }: any) {
  return (
    <Box
      // className='section-border'
      sx={() => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <SubMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default HRSubMenu;
