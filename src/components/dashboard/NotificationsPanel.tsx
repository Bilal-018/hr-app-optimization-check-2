/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import {
  PopoverItem,
  PopoverItemInfoContainer,
} from '../Navigation/Topbar/Notifications/Notifications.styles';
import BasicTabs from '../Global/BasicTabs';
import { RedMailIcon } from '../../assets/images';
import jwtInterceptor from '../../services/interceptors';
import { useTranslation } from 'react-i18next';

interface NotificationOption {
  id: number;
  description: string;
}

interface NotificationItem {
  id: number;
  date: string;
  notifications: NotificationOption[];
}

// interface NotificationData {
//   goal: NotificationItem[];
//   leaves: NotificationItem[];
//   payroll: NotificationItem[];
// }

interface LeavesProps {
  NOTIFICATIONS: NotificationItem[];
}

function Leaves({ NOTIFICATIONS }: LeavesProps) {
  const { t } = useTranslation();

  if (NOTIFICATIONS.length === 0) {
    return (
      <Box>
        <Typography className='extraSmallBody'>No Notifications</Typography>
      </Box>
    );
  }

  return (
    <>
      {NOTIFICATIONS.map((item: any) => (
        <Box key={item.id}>
          <Typography className='extraSmallBody'>{t(item.date)}</Typography>
          <Box>
            {item.notifications.map((option: any) => (
              <PopoverItem
                key={option.id}
                sx={(theme) => ({
                  '&:hover': {
                    color: theme.palette.text.primary,
                  },
                })}
              >
                <img src={RedMailIcon} alt='icon' />
                <PopoverItemInfoContainer>
                  <Typography className='body'>
                    {t(option.description)}
                  </Typography>
                </PopoverItemInfoContainer>
              </PopoverItem>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}

function NotificationsPanel() {
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const [goalsNotifications, setGoalsNotifications] =
    useState<JSX.Element | null>(null);
  const [leaveNotifications, setLeaveNotifications] =
    useState<JSX.Element | null>(null);
  const [payslipsNotifications, setPayslipsNotifications] =
    useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);
  const base_url = process.env.REACT_APP_BASE_URL;

  const GetEmployeeNotifications = () => {
    setLoading(true);

    jwtInterceptor
      .get(
        'api/EmployeeNotification/GetNotificationListByEmployeeDetailID?EmployeeDetailId=' +
          empId
      )
      .then((response: any) => {
        const allGoals = response.data.goal.map((x: any) => ({
          id: x.id,
          date: x.date,
          notifications: x.notifications,
        }));

        const allLeaves = response.data.leaves.map((x: any) => ({
          id: x.id,
          date: x.date,
          notifications: x.notifications,
        }));

        const allPayslips = response.data.payroll.map((x: any) => ({
          id: x.id,
          date: x.date,
          notifications: x.notifications,
        }));

        setGoalsNotifications(<Leaves NOTIFICATIONS={allGoals} />);
        setLeaveNotifications(<Leaves NOTIFICATIONS={allLeaves} />);
        setPayslipsNotifications(<Leaves NOTIFICATIONS={allPayslips} />);
      })
      .finally(() => { setLoading(false) });
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetEmployeeNotifications();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <BasicTabs
        tabs={['Leaves', 'Payslips']}
        tabPanels={[leaveNotifications, payslipsNotifications]}
        sx={{
          '.MuiTabs-flexContainer': {
            justifyContent: 'start',
          },
        }}
      />
    </Box>
  );
}

export default NotificationsPanel;
