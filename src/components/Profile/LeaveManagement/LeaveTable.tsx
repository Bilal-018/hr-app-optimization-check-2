import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ManagerLeaveTable from './ManagerLeaveTable';
import EmployeeLeaveTable from './EmployeeLeaveTable';
import { useTranslation } from 'react-i18next';
import { SelectCatStyle } from '../SkillManagement/SkillsTable';

const styles = {
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 850px)': {
      flexDirection: 'column',
      gap: '15px',
    },
  },
  optionsContainer: {
    display: 'flex',
    gap: '15px',
  },
};

const RenderTable = ({ subMenu }: any) => {
  switch (subMenu) {
    case 'Employee':
      return <EmployeeLeaveTable />;
    case 'Manager':
      return <ManagerLeaveTable />;
    default:
      return <EmployeeLeaveTable />;
  }
};

function LeaveTable() {
  const [subMenu, setSubMenu] = useState<any>('Employee');
  const roleskey = sessionStorage.getItem('roles');
  // let isManager = roleskey.includes('Manager') ? 'flex' : 'none';
  let isManager = roleskey?.includes('Manager') ? 'flex' : 'none';

  const { t } = useTranslation();

  return (
    <Box boxShadow={'4px 4px 16px rgba(9, 44, 76, 0.10),-4px -4px 16px rgba(9, 44, 76, 0.10)'} py='18px' px='34px' borderRadius={3} mt={2}>
      <Box sx={styles.topContainer}>
        <Box sx={styles.optionsContainer}>
          <Box
            className='c-l'
            sx={(theme) => ({
              cursor: 'pointer',

              ...(subMenu === 'Employee' && SelectCatStyle(theme)),
            })}
            onClick={() => { setSubMenu('Employee') }}
          >
            <PersonIcon />
            <Typography className='smallBody'>{t('Employee')}</Typography>
          </Box>
          <Box
            className='c-l'
            sx={(theme) => ({
              cursor: 'pointer',
              display: isManager,

              ...(subMenu === 'Manager' && SelectCatStyle(theme)),
            })}
            onClick={() => { setSubMenu('Manager') }}
          >
            <PeopleIcon />
            <Typography className='smallBody'>{t('Manager')}</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <RenderTable subMenu={subMenu} />
      </Box>
    </Box>
  );
}

export default LeaveTable;
