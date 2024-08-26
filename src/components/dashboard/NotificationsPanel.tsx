import { Box, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import {
  PopoverItem,
  PopoverItemInfoContainer,
} from '../Navigation/Topbar/Notifications/Notifications.styles';
import BasicTabs from '../Global/BasicTabs';
import { RedMailIcon } from '../../assets/images';
import jwtInterceptor from '../../services/interceptors';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

interface NotificationOption {
  id: number;
  description: string;
}

interface NotificationItem {
  id: number;
  date: string;
  notifications: NotificationOption[];
}

interface LeavesProps {
  NOTIFICATIONS: NotificationItem[];
}

interface Response {
  leaves: Leave[];
  payroll: Payroll[];
  goal: any;
}

interface Leave {
  identityId: number;
  date: string;
  notifications: Notification[];
}

interface Payroll {
  identityId: number;
  date: string;
  notifications: Notification[];
}

interface Notification {
  id: number;
  title: string;
  description: string;
  url: string;
  transactionId: number | null;
  toWhom: string | null;
  notificationType: string | null;
  modifiedDate: string | null;
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
      {NOTIFICATIONS.map((item: NotificationItem) => (
        <Box key={item.id}>
          <Typography className='extraSmallBody'>{t(item.date)}</Typography>
          <Box>
            {item.notifications.map((option: NotificationOption) => (
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
  const [leaveNotifications, setLeaveNotifications] =
    useState<JSX.Element | null>(null);
  const [payslipsNotifications, setPayslipsNotifications] =
    useState<JSX.Element | null>(null);
  const initialized = useRef(false);
  const base_url = process.env.REACT_APP_BASE_URL;

  const GetEmployeeNotifications = () => {
    // eslint-disable-next-line
    jwtInterceptor
      .get(
        'api/EmployeeNotification/GetNotificationListByEmployeeDetailID?EmployeeDetailId=' +
          empId
      )
      .then((response: AxiosResponse<Response>) => {
        const allLeaves = response.data.leaves.map((x: Leave) => ({
          id: x.identityId,
          date: x.date,
          notifications: x.notifications,
        }));

        const allPayslips = response.data.payroll.map((x: Payroll) => ({
          id: x.identityId,
          date: x.date,
          notifications: x.notifications,
        }));

        setLeaveNotifications(<Leaves NOTIFICATIONS={allLeaves} />);
        setPayslipsNotifications(<Leaves NOTIFICATIONS={allPayslips} />);
      })
      .finally(() => { console.log("Got Notifications List") });
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
