import {
  Box, LinearProgress, Typography, Stack, useMediaQuery, useTheme
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import Center from '../../components/Box/Center';

import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../services/interceptors';
import LeavesInfo from '../../components/dashboard/LeavesInfo';
import DashboardAnnouncement from './DashboardAnnouncement';
import Notifications from './Notifications';
import WeeklyCalendar from '../../components/dashboard/WeeklyCalander';
import RenewalCertificate from './CertificateRenewal';
import DashboardHeader from './DashboardHeader';
import CircularProgress from '@mui/material/CircularProgress';

const styles = {
  TypographyFontSize: () => ({
    fontSize: '0.9rem',
  }),
  skillTypographyFontSize: () => ({
    fontSize: '0.7rem',
  }),
};
const EmptySpanStyle = {
  paddingRight: '8px',
};
const EmployeeSpanStyle = {
  fontSize: '0.9rem',
  display: 'inline',
};
const SkillCard = ({ id, label, value }: any) => {
  // eslint-disable-next-line default-case
  switch (id) {
    case '0':
      return (
        <Box borderRadius={999} top={105} left={114} position='absolute'>
          <Center
            flexDirection='column'
            bgcolor='rgba(251, 148, 27, 0.76)'
            width={100}
            height={100}
            borderRadius={999}
            sx={{ scale: '1.2', margin: 1 }}
          >
            <CircularProgress
              variant='determinate'
              size={110}
              thickness={1}
              value={value} // assuming value is a percentage
              sx={{ color: 'rgba(251, 148, 27, 0.76)' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color='#fff' variant='h6'>
                {value + '%'}
              </Typography>
              <Typography
                color='#fff'
                sx={{
                  textAlign: 'center',
                }}
              >
                {label}
              </Typography>
            </Box>
          </Center>
        </Box>
      );
    case '1':
      return (
        <Box borderRadius={999} top={122} left={5} position='absolute'>
          <Center
            flexDirection='column'
            bgcolor='#2FBFDE'
            width={100}
            height={100}
            borderRadius={999}
            sx={{ scale: '0.9' }}
          >
            <CircularProgress
              variant='determinate'
              size={110}
              thickness={1}
              value={value}
              sx={{ color: '#2FBFDE' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color='#fff' variant='h6'>
                {value + '%'}
              </Typography>
              <Typography color='#fff'>{label}</Typography>
            </Box>
          </Center>
        </Box>
      );
    case '2':
      return (
        <Box borderRadius={999} top={45} left={50} position='absolute'>
          <Center
            flexDirection={'column'}
            bgcolor={'rgba(89, 87, 255, 0.79)'}
            width={100}
            height={100}
            borderRadius={999}
            sx={{ scale: '0.7' }}
            zIndex={11}
          >
            <CircularProgress
              variant='determinate'
              size={110}
              thickness={1}
              value={value}
              sx={{ color: 'rgba(89, 87, 255, 0.79)' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color='#fff' variant='h6'>
                {value + '%'}
              </Typography>
              <Typography
                color='#fff'
                sx={() => styles.skillTypographyFontSize()}
              >
                {label}{' '}
              </Typography>
            </Box>
          </Center>
        </Box>
      );
  }
};


function Dashboard() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<any>(true);

  const fullName = sessionStorage.getItem('fullname');
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const initialized = useRef(false);
  const [skillInfos, setskillInfoState] = useState<any>([]);
  const [dashboardDetails, setdashboardDetails] = useState<any>([]);
  const { t } = useTranslation();
  const base_url = process.env.REACT_APP_BASE_URL;

  const getSkillInfos = () => {
    jwtInterceptor
      .get('api/HrDashboard/GetHrDashboardTopSkills')
      .then((response: any) => {
        let objSkills = [];
        // Sort the array in descending order based on the "percentage" property
        const sortedData = response.data.sort((a: any, b: any) => {
          const percentageA = parseFloat(a.percentage);
          const percentageB = parseFloat(b.percentage);
          return percentageB - percentageA;
        });
        const top3Skills = sortedData.slice(0, 3);

        for (let i in top3Skills) {
          objSkills.push({
            id: i,
            label: top3Skills[i].skill,
            value: Math.round(top3Skills[i].percentage.replace('%', '')),
          });
        }
        setskillInfoState(objSkills);
        setLoading(false);
      });
  };

  const getDashboardDetails = () => {
    jwtInterceptor
      .get(
        'api/Dashboard/GetDashboardByEmployeeDetailId?EmployeeDetailId=' + empId
      )
      .then((response: any) => {
        // alert(JSON.stringify(response.data))

        setdashboardDetails(response.data);

      })
      ;
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getSkillInfos();
        getDashboardDetails();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {loading ? ( // Render loader if data is still loading
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100vh'
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          // bgcolor={(theme) => theme.palette.background?.backLessOps}
          borderRadius={4}
          sx={{
            alignItems: 'flex-start',
            px: { xs: '20px', md: 2 },
            py: 2,
            // '@media (max-width: 1260px)': {
            //   pr: '20px',
            // },
            position: 'relative',
            zIndex: 0
          }}
        >
          <Center
            sx={{
              flexDirection: { lg: 'row', xs: 'column' },
              alignItems: 'flex-start'
            }}
          >
            <Box
              flex={2}
              sx={{
                p: { xs: 0, md: 3 },
                width: { xs: '100%', lg: 'auto' },
              }}
            >
              <Typography variant='h5' fontWeight={600} sx={{ display: { xs: 'none', md: 'block' } }}>
                {t('Hi')}, {fullName}
              </Typography>
              <Typography variant='body1' mt={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                {t('Welcome to your HR environment')}
              </Typography>
              <Typography variant='h6' px='12px' fontWeight={600} sx={{ display: { xs: 'block', md: 'none' } }}>
                {t('Hi')}, {fullName}
              </Typography>
              <Typography mt={2} px='12px' textAlign={'right'} fontSize={14} sx={{ display: { xs: 'block', md: 'none' } }}>
                {t('Welcome to your HR environment')}
              </Typography>
              <Box gap={{xs:2, lg:4}} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }} mt={4}>
                <Box sx={{ flex: {lg: 1.5, xl:2, xs:2}, width: '100%' }}>
                  <DashboardHeader />
                </Box>
                <Stack position={'relative'} minHeight={210} height={350} sx={{ flex: 1, px: { xs: '12px', md: 0 } }}>
                  <Typography fontWeight={500} fontSize={15}>
                    Skill Management
                  </Typography>
                  <Center>
                    {skillInfos.map((skill: any) => (
                      <SkillCard {...skill} key={skill.id} />
                    ))}
                  </Center>
                </Stack>
              </Box>
              <Center sx={{ mt: 4, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }} mt={3} gap={3}>
                <RenewalCertificate />
                <Box flex={1} px={{ xs: '12px', md: 0 }} width={{ xs: '100%', md: 'auto' }} maxWidth={'484px'}>
                  <Typography
                    variant='h6'
                    sx={{ display: { xs: 'none', md: 'block' } }}
                    mb={4}
                    fontWeight={600}
                    color={'#E0E0E0'}
                  >
                    {t('Attendance')}
                  </Typography>
                  <Typography
                    fontSize={18}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    mb={4}
                    fontWeight={600}
                    color={'#E0E0E0'}
                  >
                    {t('Attendance')}
                  </Typography>
                  <Typography variant='h6' fontWeight={600}>
                    {dashboardDetails.totalEmployees} employees
                    <span style={EmptySpanStyle}> </span>
                    <Typography
                      style={EmployeeSpanStyle}
                      color={(theme) => theme.palette.action.disabled}
                    >
                      Total
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={dashboardDetails.totalEmployees}
                    sx={{ borderRadius: 999, height: 10, mt: 2 }}
                  />
                  {/* <Center mt={2} gap={2} sx={{ justifyContent: "flex-start" }}>
                <Box>
                  <Center gap={1}>
                    <Box
                      sx={{
                        height: 3,
                        borderRadius: 999,
                        bgcolor: customColor.primary,
                        width: 22,
                      }}
                    ></Box>

                    <Typography
                      color={customColor.light_text}
                      sx={{ fontWeight: 600, mr: "auto" }}
                    >
                      Clock In
                    </Typography>
                  </Center>

                  <Typography color={customColor.light_text} sx={{ fontWeight: 600, ml: "30px" }}>
                    20 employees
                  </Typography>
                </Box>

                <Box>
                  <Center gap={1}>
                    <Box
                      sx={{
                        height: 3,
                        borderRadius: 999,
                        bgcolor: customColor.primary,
                        width: 22,
                      }}
                    ></Box>

                    <Typography
                      color={customColor.light_text}
                      sx={{ fontWeight: 600, mr: "auto" }}
                    >
                      Absence
                    </Typography>
                  </Center>

                  <Typography color={customColor.light_text} sx={{ fontWeight: 600, ml: "30px" }}>
                    20 employees
                  </Typography>
                </Box>
              </Center> */}
                </Box>
              </Center>
            </Box>
            <Box flex={1}
              sx={{
                width: { xs: '100%', lg: 'auto' },
                maxWidth: { lg: '495px' },
                display: 'flex',
                flexDirection: { lg: 'column', md: 'row', xs: 'column' },
                padding: { xs: '0', md: '0 24px' }
              }}
            >
              <WeeklyCalendar />
              <LeavesInfo />
              <DashboardAnnouncement />
              <Notifications leavesTaken={dashboardDetails.leavesTaken} />
            </Box>
          </Center>

          {/* <img
            src={purple}
            alt='img'
            style={{
              position: 'absolute',
              bottom: 0,
              left: '-100px',
              // zIndex: '100',
            }}
          /> */}

          <div
            style={{
              display: matches ? 'block' : 'none',
              position: 'absolute',
              bottom: '-30px',
              left: '50px',
              borderRadius: '283px',
              background: 'rgba(68, 78, 237, 0.20)',
              filter: 'blur(75px)',
              height: '283px',
              width: '280px',
              zIndex: -1
            }}></div>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
