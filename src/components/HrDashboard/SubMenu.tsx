
import React from 'react';
import { Box } from '@mui/material';
import { SUB_MENU } from '../../pages/HrDashboard';
import Dashboard from './Dashboard';
import PaySlip from './Payslip/PaySlip';
import EmployeeInfo from './EmployeeInfo';
import EmployeeDocs from './EmployeeDocs';
import Assets from './Assets';
import LeaveManagement from './LeaveManagement';
import SkillsManagement from '../AdminSettings/SkillsManagement';
import AnnouncementsList from '../dashboard/AnnouncementsList';


type ActiveMenuType = keyof typeof SUB_MENU;

function SubMenu({ activeMenu }: { activeMenu: ActiveMenuType }) {
  switch (activeMenu) {
    case SUB_MENU.dashboard:
      return <Dashboard />;
    case SUB_MENU.announcement:
      return <AnnouncementsList />;
    case SUB_MENU.payslip:
      return <PaySlip role="admin" />;
    case SUB_MENU.employeeInfo:
      return <EmployeeInfo />;
    case SUB_MENU.employeeDocuments:
      return <EmployeeDocs />;
    case SUB_MENU.assets:
      return <Assets />;
    case SUB_MENU.leaveManagement:
      return <LeaveManagement />;

    case SUB_MENU.skillManagement:
      return <SkillsManagement />;

    default:
      return <Dashboard />;
  }
}

function HRDashboardSubMenu({ activeMenu }: { activeMenu: ActiveMenuType }) {
  return (
    <Box
      className="section-border"
      mt="20px"
      sx={() => ({
        // border: `${
        //   activeMenu === "dashboard"
        //     ? "none"
        //     : `1px solid ${theme.palette.common.border}`
        // } `,
      })}
    >
      <SubMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default HRDashboardSubMenu;
