import { Box, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import StatBox from '../../components/Global/StatBox';
import SkillsTable from '../../components/Profile/SkillManagement/SkillsTable';
import jwtInterceptor from '../../services/interceptors';
import { useSnackbar } from '../../components/Global/WithSnackbar';
import { useTranslation } from 'react-i18next';
import Award from '../../assets/images/Award';
import RightArrow from '../../assets/images/RightArrow';
import Tick from '../../assets/images/Tick';

const styles = {
  statsContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px',
    justifyContent: 'flex-start',
  },
};

interface SkillKPIs {
  totalSkillRegistered?: number;
  renewalPending?: number;
  newSkillRegistered?: number;
}

function SkillsManagement() {
  const { t } = useTranslation();

  const [skillKPIs, setSkillKPIsState] = useState<SkillKPIs>({});
  const initialized = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const { showMessage }: any = useSnackbar();

  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  const getData = () => {
    setLoading(true);

    jwtInterceptor
      .get('api/EmployeeSkill/SkillTopSectionDetail?EmployeeDetailId=' + empId)
      .then((response: any) => {
        setSkillKPIsState(response.data);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      })
      .finally(() => { setLoading(false) });

    //const data = await service.GetSkillListDataRequest();
    //console.log(data);
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        p: '20px',
        marginTop: '40px',
        position: 'relative',

        '@media (max-width: 600px)': {
          p: '10px',
          marginTop: '20px',
        },
      }}
    >
      <Typography variant='h6'>{t('Skill Management')}</Typography>
      <Box sx={styles.statsContainer}>
        <StatBox
          title={t('Total of skills registered')}
          value={skillKPIs.totalSkillRegistered}
          icon={<Award />}
          color='#18A0FB'
          hideProgress={true}
        />
        <StatBox
          title={t('Certificates pending renewal')}
          value={skillKPIs.renewalPending}
          icon={<RightArrow />}
          color='#E01C63'
          hideProgress={true}
        />
        {/* <StatBox
          title={t("Number of recognition received")}
          value="0"
          icon={<WorkspacePremiumIcon />}
          color="#964CF5"
          hideProgress={true}
        /> */}
        <StatBox
          title={t('New skills register')}
          value={skillKPIs.newSkillRegistered}
          icon={<Tick />}
          color='#9DB604'
          hideProgress={true}
        />
      </Box>
      <SkillsTable />
    </Box>
  );
}

export default SkillsManagement;
