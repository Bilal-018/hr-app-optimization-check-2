import { Box } from '@mui/material';
import { SUB_MENU } from '../../pages/AdminSettings';
import EmployeeInfo from './EmployeeInfo';
import LeaveManagement from './LeaveManagement';

interface AdminSettingsSubMenuProps {
  activeMenu: string;
}

function SubMenu({ activeMenu }: AdminSettingsSubMenuProps) {
  switch (activeMenu) {
    case SUB_MENU.employeeInfo:
      return <EmployeeInfo />;
    case SUB_MENU.leaveManagent:
      return <LeaveManagement />;
    default:
      return <EmployeeInfo />;
  }
}

function AdminSettingsSubMenu({ activeMenu }: AdminSettingsSubMenuProps) {
  return (
    <Box>
      <SubMenu activeMenu={activeMenu} />
    </Box>
  );
}

export default AdminSettingsSubMenu;
