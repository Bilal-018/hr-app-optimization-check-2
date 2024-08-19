import { Box, Grid } from '@mui/material';
import React, { useEffect, useState, useRef, useContext } from 'react';
import KPIS from '../components/dashboard/KPIS';
import CompanyPresentation from '../components/dashboard/CompanyPresentation';
import Announcements from '../components/dashboard/Announcements';
import SlaebCalender from '../components/dashboard/SlaebCalender';
import LeavesInfo from '../components/dashboard/LeavesInfo';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import PeopleIcon from '@mui/icons-material/People';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import LogoutIcon from '@mui/icons-material/Logout';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import jwtInterceptor from '../services/interceptors';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../theme';

const styles = {
  container: (color: any) => ({
    backgroundColor: color,
    width: '100%',
    m: '0px',
    pr: '15px',
    minHeight: '100vh',
  }),
  headerContainer: (theme: any) => ({
    p: '40px',
    borderRadius: '20px',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.backLessOps,
    justifyContent: 'center',
    gap: '22px',
    h1: {
      margin: '0px',
    },
    h2: {
      margin: '0px',
    },
  }),
  infoContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  }),
  calenderContainer: (theme: any) => ({
    borderRadius: '30px',
    background: theme.palette.background.backLessOps,
    p: '15px',
    height: 'fit-content',
    mt: {
      xs: '50px',
      md: '15px',
    },
  }),
  notificationsPanelContainer: (theme: any) => ({
    borderRadius: '10px',
    background: theme.palette.background.backLessOps,
    boxShadow: '0px 4px 8px 0px rgba(9, 44, 76, 0.10)',
  }),
};

function Dashboard() {
  const fullName = sessionStorage.getItem('fullname');
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');

  const [dashboardkpis, setdashboardkpis] = useState<any>([]);
  const initialized = useRef(false);

  const { t } = useTranslation();
  const { myTheme }: any = useContext(themeContext);

  const containerColor = myTheme.name === 'dark' ? 'transparent' : '#F5F5F5';
  const base_url = process.env.REACT_APP_BASE_URL;

  const GetdashboardKPIData = () => {
    jwtInterceptor
      .get(
        'api/Dashboard/GetDashboardByEmployeeDetailId?EmployeeDetailId=' + empId
      )
      .then((response: any) => {
        //
        let kpiInfo = [];
        let item1 = {
          title: t('Headcount'),
          value: response.data.totalEmployees,
          color: '#18A0FB',
          icon: <PeopleIcon />,
        };

        let item2 = {
          title: t('My Leaves'),
          value: response.data.totalLeaves,
          color: '#9DB604',
          icon: <PermDeviceInformationIcon />,
        };
        let item3 = {
          title: t('Leaves taken'),
          value: response.data.leavesTaken,
          color: '#19C03E',
          icon: <LogoutIcon />,
        };
        let item4 = {
          title: t('Goals completed'),
          value: '0%',
          color: '#964CF5',
          icon: <CrisisAlertIcon />,
        };

        kpiInfo.push(item1);
        kpiInfo.push(item2);
        kpiInfo.push(item3);
        kpiInfo.push(item4);
        setdashboardkpis(kpiInfo);
        //
      });
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetdashboardKPIData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      spacing={2}
      justifyContent='space-between'
      sx={() => styles.container(containerColor)}
    >
      <Grid item xs={12} md={7.5} sx={() => styles.infoContainer()}>
        <Box
          sx={(theme) => styles.headerContainer(theme)}
          className='header-bg'
        >
          <h1
            className='f-b-c'
            style={{
              width: '40%',
            }}
          >
            <span>
              {t('Hi')} {fullName}
            </span>
            <span>👋</span>
          </h1>
          <h2>{t('Welcome to your HR environment')}</h2>
        </Box>
        <KPIS kpis={dashboardkpis} />
        <CompanyPresentation />
        <Announcements />
      </Grid>
      <Grid item xs={12} md={4} sx={(theme) => styles.calenderContainer(theme)}>
        <SlaebCalender />
        <LeavesInfo />
        <Box sx={(theme) => styles.notificationsPanelContainer(theme)}>
          <NotificationsPanel />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
