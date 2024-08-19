import React from 'react';
import { Box } from '@mui/material';
import { SUB_MENU } from '../../pages/AdminSettings';
import EmployeeInfo from './EmployeeInfo';
import LeaveManagement from './LeaveManagement';

function SubMenu({ activeMenu }: any) {
  switch (activeMenu) {
    case SUB_MENU.employeeInfo:
      return <EmployeeInfo />;
    case SUB_MENU.leaveManagent:
      return <LeaveManagement />;
   
    // case SUB_MENU.announcement:
    //   return <AnnouncementsList />;
    // case SUB_MENU.asset:
    //   return <Assets />;
    default:
      return <EmployeeInfo />;
  }
}

function AdminSettingsSubMenu({ activeMenu }: any) {
  return (
    <Box>
      <SubMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default AdminSettingsSubMenu;
