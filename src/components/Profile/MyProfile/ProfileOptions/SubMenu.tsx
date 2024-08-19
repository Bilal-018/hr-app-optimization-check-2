import React from 'react';
import { SUB_MENU } from '.';
import Profile from './Profile';
import BankAccount from './BankAccount';
import Documents from './Documents';
import Assets from './Assets';
import PaySlip from '../../../HrDashboard/Payslip/PaySlip';
import { Box } from '@mui/material';

function SubMenu({ activeMenu }: any) {
  const empId = sessionStorage.getItem('empId_key');
  switch (activeMenu) {
    case SUB_MENU.profile:
      return <Profile />;
    case SUB_MENU.bankAccount:
      return <BankAccount />;
    case SUB_MENU.documents:
      return <Documents />;
    case SUB_MENU.assets:
      return <Assets />;
    case SUB_MENU.payroll:
      return <PaySlip empid={empId} />;
    default:
      return <Profile />;
  }
}

function SubMenuLayout({ activeMenu }: any) {
  return (
    <Box
      className='section-border'
      mt='20px'
      sx={() => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <SubMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default SubMenuLayout;
