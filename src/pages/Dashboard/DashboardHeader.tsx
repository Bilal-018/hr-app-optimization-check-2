import { Button, LinearProgress, Stack, Typography, Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import profileService from '../../services/myprofile';
import { DashboardImg } from '../../assets/images';
import TextIcon from '../../components/Icon/TextIcon';
import useStyles from './IconStyle';

interface Counts {
  totalSickLeaves: number;
  totalAnnualLeaves: number;
}

const initialCounts: Counts = {
  totalSickLeaves: 0,
  totalAnnualLeaves: 0,
};

const DashboardHeader: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const classes = useStyles();
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const initialized = useRef(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [topCounts, setTopCountsState] = useState<Counts>(initialCounts);
  const base_url = process.env.REACT_APP_BASE_URL;

  const getLeaveDetails = async () => {
    if (!empId || !bearerToken) return;

    const url = `api/EmployeeLeave/GetLeaveDashboardYTD?EmployeeDetailId=${empId}&Year=${currentYear}`;
    const response = await profileService.GetLeavesListDataRequest(
      url,
      bearerToken
    );
    setTopCountsState({
      totalSickLeaves: response.totalSickLeaves,
      totalAnnualLeaves: response.totalAnnualLeaves,
    });
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        void getLeaveDetails();
      } else {
        window.location.href= base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box flex={1} pl='12px'>
        <Typography fontWeight={500} fontSize={15}>
          {t('My Leave Management')}
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: {xs:'space-between', md:'flex-start'},
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Annual Leave */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                alignItems: 'center',
                pb: 1,
              }}
            >
              <TextIcon
                color='#19C03E'
                fontSize={16}
                icon='ion:exit'
                size={25}
              />
              <Typography
                color={(theme) => theme.palette.action.disabled}
                fontWeight={700}
                sx={{ fontSize: 12 }}
              >
                {t('Annual Leave')}
              </Typography>
            </Box>
            <Typography variant='h6' sx={{ display: { xs: 'none', md: 'block' } }} fontWeight={600} mt={1} mb={1}>
              {topCounts.totalAnnualLeaves} days
            </Typography>
            <Typography fontSize={14} sx={{ display: { xs: 'block', md: 'none' } }} fontWeight={600} mt={1} mb={1}>
              {topCounts.totalAnnualLeaves} days
            </Typography>
            <LinearProgress
              variant='determinate'
              value={topCounts.totalAnnualLeaves}
              sx={{ borderRadius: 999 }}
            />
          </Box>
          {/* Sick Leave */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                alignItems: 'center',
                pb: 1,
              }}
            >
              <TextIcon
                color='#964CF5'
                fontSize={16}
                icon='mdi:fever'
                size={25}
              />
              <Typography
                color={(theme) => theme.palette.action.disabled}
                fontWeight={700}
                sx={{ fontSize: 12 }}
              >
                {t('Sick Leave')}
              </Typography>
            </Box>
            <Typography variant='h6' sx={{ display: { xs: 'none', md: 'block' } }} fontWeight={600} mt={1} mb={1}>
              {topCounts.totalSickLeaves} days
            </Typography>
            <Typography fontSize={14} sx={{ display: { xs: 'block', md: 'none' } }} fontWeight={600} mt={1} mb={1}>
              {topCounts.totalSickLeaves} days
            </Typography>
            <LinearProgress
              variant='determinate'
              value={topCounts.totalSickLeaves}
              color='error'
              sx={{ borderRadius: 999 }}
            />
          </Box>
        </Box>
        {/* Corporate documents */}
        <Stack
          sx={{
            minWidth:'265px',
            ml:{xs:'-5px', md:0},
            background: `url(${DashboardImg}) no-repeat`,
            backgroundSize: 'cover',
            p: 2,
            borderRadius: {xs:'20px',md:3},
            '.MuiTypography-root': { color: '#fff' },
            alignItems: 'flex-start',
            minHeight: {xs:180, md:220},
            mt: 3,
          }}
        >
          <Typography variant='h6' sx={{ display: { xs: 'none', md: 'block' } }} fontWeight={600}>
            {t('Corporate documents')}
          </Typography>
          <Typography fontSize={14} sx={{ display: { xs: 'block', md: 'none' } }} fontWeight={600}>
            {t('Corporate documents')}
          </Typography>
          <Typography style={{ fontSize: '0.7rem' }} sx={{ mt: 1 }}>
            {t('Here is the repository for corporate documents.')}
          </Typography>
          <Button
            endIcon={<FaArrowRight />}
            sx={{
              svg: { fontSize: '14px !important' },
              mt: 'auto',
              color: '#fff !important',
            }}
            style={{ fontSize: '0.7rem' }}
            onClick={() => { navigate('/presentations') }}
          >
            {t('Read More')}
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default DashboardHeader;
