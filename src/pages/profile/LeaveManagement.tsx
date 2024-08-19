import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SickIcon from '@mui/icons-material/Sick';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaveTable from '../../components/Profile/LeaveManagement/LeaveTable';
import StatBox from '../../components/Global/StatBox';
import profileService from '../../services/myprofile';
import { useTranslation } from 'react-i18next';

const styles = {
  statsContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
};

interface Counts {
  totalApprovedLeaves: number;
  totalPendingLeaves: number;
  totalSickLeaves: number;
  totalCasualLeaves: number;
}

const initialCounts: Counts = {
  totalApprovedLeaves: 0,
  totalPendingLeaves: 0,
  totalSickLeaves: 0,
  totalCasualLeaves: 0,
};

function LeaveManagement() {
  const [topCounts, setTopCountsState] = useState<Counts>(initialCounts);
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');

  const { t } = useTranslation();

  useEffect(() => {
    void getLeavesListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLeavesListData = async () => {
    let url = 'api/EmployeeLeave/GetLeaveDashboard?EmployeeDetailId=' + empId;
    let response = await profileService.GetLeavesListDataRequest(
      url,
      bearerToken ?? ''
    );
    setTopCountsState({
      totalApprovedLeaves: response.totalApprovedLeaves,
      totalPendingLeaves: response.totalPendingLeaves,
      totalSickLeaves: response.totalSickLeaves,
      totalCasualLeaves: response.totalCasualLeaves,
    });
  };

  return (
    <Box
      sx={{
        p: '20px',
        marginTop: '40px',
        '@media (max-width: 600px)': {
          p: '10px',
          marginTop: '20px',
        },
      }}
    >
      <Typography variant='h6'>{t('Leave Management')}</Typography>
      <Box sx={styles.statsContainer}>
        <StatBox
          title={t('Annual leave taken')}
          value={topCounts.totalApprovedLeaves}
          icon={<LogoutIcon />}
          color='#19C03E'
        />
        <StatBox
          title={t('Casual leave taken')}
          value={topCounts.totalCasualLeaves}
          icon={<CheckCircleIcon />}
          color='#18A0FB'
        />
        <StatBox
          title={t('Leaves pending approval')}
          value={topCounts.totalPendingLeaves}
          icon={<CheckCircleIcon />}
          color='#E2B93B'
        />
        <StatBox
          title={t('Sick days taken')}
          value={topCounts.totalSickLeaves}
          icon={<SickIcon />}
          color='#964CF5'
        />
      </Box>
      <LeaveTable />
    </Box>
  );
}

export default LeaveManagement;
