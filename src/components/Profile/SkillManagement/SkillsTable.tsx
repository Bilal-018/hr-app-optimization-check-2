import { Box, Typography, useMediaQuery } from '@mui/material';
import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import EmployeeSkillsTable from './EmployeeSkillsTable';
import ManagerSkillsTable from './ManagerSkillsTable';
import { useTranslation } from 'react-i18next';
import jwtInterceoptor from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';

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
export const SelectCatStyle = (theme: any) => ({
  padding: '8px 10px',
  background: theme.palette.background.lightBack,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '40px',
  color: theme.palette.primary.main,
});

const RenderTable = ({ subMenu }: any) => {
  switch (subMenu) {
    case 'Employee':
      return <EmployeeSkillsTable />;
    case 'Manager':
      return <ManagerSkillsTable />;
    default:
      return <EmployeeSkillsTable />;
  }
};

function SkillsTable() {
  const [subMenu, setSubMenu] = useState<any>('Employee');
  const roleskey = sessionStorage.getItem('roles');
  let isManager: any = roleskey?.includes('Manager') ? 'flex' : 'none';
  const { t } = useTranslation();

  const between1281And1400 = useMediaQuery('(min-width: 1281px) and (max-width: 1400px)');
  const between1200And1280 = useMediaQuery('(min-width: 1200px) and (max-width: 1280px)');

  const { showMessage }: any = useSnackbar();
  const [experts, setallExpertsListDataState] = useState<any>([]);

  const GetSkillsExpertsConfigurationListData = () => {
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillExpertiseList')
      .then((response: any) => {
        let allExperties = [];
        for (var x of response.data) {
          let item = {
            skillExpertiseId: x.skillExpertiseId,
            expertise: x.expertise,
            agendaColor: x.agendaColor,
          };
          allExperties.push(item);
        }

        setallExpertsListDataState(allExperties);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      })
  };

  useEffect(() => {
    GetSkillsExpertsConfigurationListData();
  }, []);

  return (
    <Box boxShadow={'4px 4px 16px rgba(9, 44, 76, 0.10),-4px -4px 16px rgba(9, 44, 76, 0.10)'} py='18px' px='34px' borderRadius={3} mt={2} {...(between1281And1400 && { maxWidth: '74vw' })} {...(between1200And1280 && {maxWidth: '72vw'})}>
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

        <Box sx={{ display: 'flex', gap: 4 }}>
          {experts?.map((item: any) => (
            <Box
              key={item.skillExpertiseId}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: item.agendaColor,
                  borderRadius: '100px',
                  fontWeight: '500',
                }}
              />
              <Typography sx={{ fontSize: 10 }}>{t(item.expertise)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default SkillsTable;
