/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { InfoTwoTone as InfoTwoToneIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import jwtInterceptor, { jwtLeave } from '../../services/interceptors';
import { useNavigate } from 'react-router-dom';
import Center from '../../components/Box/Center';
import useStyles from './IconStyle';
import AnnouncementModal from '../../components/ModalPopUp/AnnouncementModal';
import BaseModal from '../../components/Global/Modal';
import employee from '../../assets/images/employee.svg';
import leaveApproved from '../../assets/images/LeaveApproved.svg';
import LeaveRequest from '../../assets/images/LeaveRequest.svg';
import LeaveReject from '../../assets/images/LeaveReject.svg';
import { t } from 'i18next';
import LeaveManagementModal1 from '../../components/Profile/LeaveManagement/LeaveManagementModal1';
import { useSnackbar } from '../../components/Global/WithSnackbar';
import ManagerLeaveApprovalModal from './ManagerLeaveApprovalModal';

interface Option {
  id: number;
  name: string;
  time: string;
  title: string;
  transactionId: number;
  toWhom: string;
  notificationType: string;
}

interface Notification {
  id: string;
  name: string;
  options: Option[];
}

interface LeavesProps {
  NOTIFICATIONS: Notification[];
  setApiRefresher: any
}

const Leaves: React.FC<LeavesProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState<any>(false);
  const empId = sessionStorage.getItem('empId_key');
  const [isLeaveManagementModalOpen, setIsLeaveManagementModalOpen] = useState<boolean>(false);
  const [notificationDetails, setNotificationDetail] = useState<any>()
  const [loadingModalData, setLoadingModalData] = useState<boolean>(true);
  const { showMessage }: any = useSnackbar();
  if (props.NOTIFICATIONS.length === 0) {
    return (
      <Box>
        <Typography variant='body1'>No Notifications</Typography>
      </Box>
    );
  }
  const getNotificationData = (leaveDetailId: number) => {
    if (!loadingModalData) {
      setLoadingModalData(true);
    }
    let url =
      `api/EmployeeLeave/GetLeaveDetailById?leaveDetailId=` + leaveDetailId;
    jwtLeave
      .post(url)
      .then((response) => {
        if (response.status === 200) {
          setNotificationDetail(response.data);
        } else {
          throw new Error('Failed to fetch leave detail');
        }
      })
      .catch((error) => {
        console.error('Error fetching leave detail:', error);
        throw error;
      })
      .finally(() => { setLoadingModalData(false) });
  }

  const handleEmployNotification = (leaveDetailId: number) => {
    getNotificationData(leaveDetailId);
    setOpen(true)
  };

  const handleManagerNotification = (leaveDetailId: number) => {
    // setOpen(true) 
    getNotificationData(leaveDetailId);

    setIsLeaveManagementModalOpen(true)
  };

  const approveOrReject = (
    status: any,
    leaveId: any,
    managerComment1: any
  ) => {
    let item = {
      leaveDetailId: leaveId,
      managerComment: managerComment1,
      leaveStatus: status,
    };
    let url = 'api/LeaveManager/LeaveApproveReject';

    jwtLeave
      .post(url, item)
      .then((res) => {
        props.setApiRefresher((prev: boolean) => !prev)
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      });
  };

  const reversedNotifications = [...props.NOTIFICATIONS].reverse();

  return (
    <>
      {reversedNotifications.filter(item => item.options.length > 0).map((item) => (
        <Box key={item.id}>
          <Typography fontSize={12}>{t(item.name)}</Typography>
          <Box mb='30px'>
            {item.options.map((option) => (
              <span key={option.id}>
                <Box
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                  key={option.id}
                  mt={2}
                  gap={2}
                  onClick={() => {
                    option.toWhom !== "Manager" ? handleEmployNotification(option.transactionId) : handleManagerNotification(option.transactionId)
                  }}
                >
                  {option.notificationType === "Assigned" ?
                    <img src={LeaveRequest} alt='Leave Request' /> :
                    option.notificationType === "Approved" ?
                      <img src={leaveApproved} alt='Leave Approved' /> :
                      <img src={LeaveReject} alt='Leave Reject' />
                  }
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography fontSize={16} fontWeight={500} >
                      {t(option.name)}
                    </Typography>
                    <Typography variant='body2'>
                      {/* {typeof option.time==='string' && new Date(option.time).toLocaleDateString()} */}
                    </Typography>
                  </Box>
                </Box>
                {/* <LeaveManagementModal1
              open={isLeaveManagementModalOpen}
              handleClose={() => setIsLeaveManagementModalOpen(false)}
              title='Leave Management - Manager approval'
              leaveDetailId={option.transactionId}
              selectedStatus1={"Approved"}
              onSave={(status, LeaveDetailIdForPopup, managerComment) => approveOrReject(status, LeaveDetailIdForPopup, managerComment)}
            /> */}
              </span>
            ))}
          </Box>
        </Box>
      ))}
      {isLeaveManagementModalOpen && (
        <ManagerLeaveApprovalModal
          isVisible={isLeaveManagementModalOpen}
          handleClose={() => { setIsLeaveManagementModalOpen(false); setNotificationDetail(null); }}
          leaveDetails={notificationDetails}
          isLoading={loadingModalData}
          onSave={(
            status: any,
            LeaveDetailIdForPopup: any,
            managerComment: any
          ) => approveOrReject(status, LeaveDetailIdForPopup, managerComment)}
        />
      )}

      <AnnouncementModal
        open={open}
        handleClose={() => setOpen(false)}
        title={'Leave Management - My notification'}
      >
        {loadingModalData ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
          // height='100vh'
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#092C4C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                Starting date
              </Typography>

              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#1F3F5C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                {/* 22 Apr, 2022 */}
                {notificationDetails?.startDate !== undefined && new Date(notificationDetails?.startDate).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#092C4C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                End date
              </Typography>

              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#1F3F5C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                {/* 26 Apr, 2022 */}
                {notificationDetails?.endDate !== undefined && new Date(notificationDetails?.endDate).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#092C4C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                Status
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    height: '10px',
                    width: '10px',
                    borderRadius: '100%',
                    background:
                      notificationDetails?.leaveStatus !== undefined && notificationDetails.leaveStatus === 'Pending' ?
                        '#E2B93B' :
                        notificationDetails?.leaveStatus !== undefined && notificationDetails.leaveStatus === 'Rejected' ?
                          '#FF0000' :
                          '#27AE60'
                  }}
                ></Box>

                <Typography
                  sx={(theme) => ({
                    color: theme.palette.mode === 'light' ? '#1F3F5C' : 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                  })}
                >
                  {notificationDetails?.leaveStatus}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={(theme) => ({
                  color: theme.palette.mode === 'light' ? '#092C4C' : 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                })}
              >
                No. of days
              </Typography>

              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#E2B93B',
                }}
              >
                {notificationDetails?.totalDays}
              </Typography>
            </Box>
          </Box>
        )}
      </AnnouncementModal>
    </>
  );
};

interface NotificationsProps {
  leavesTaken: number;
}

const Notifications: React.FC<NotificationsProps> = (props) => {
  const classes = useStyles();
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const [managerModal, setManagerModal] = useState<any>(false);
  const [leaveNotifications, setleaveNotifications] = useState<any | null>(
    null
  );

  const { t } = useTranslation();

  const [apiRefresher, setApiRefresher] = useState<boolean>(false);

  const [LeavesNotificationCount, setLeavesNotificationCount] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

  const GetEmployeeNotifications = async () => {
    setLoading(true);

    jwtInterceptor
      .get(
        'api/EmployeeNotification/GetNotificationListByEmployeeDetailID?EmployeeDetailId=' +
        empId
      )
      .then((response: any) => {
        let allLeaves: Notification[] = [];
        for (var x of response.data.leaves) {
          let item: Notification = {
            id: x.identityId,
            name: x.date,
            options: [],
          };

          let options: Option[] = [];

          for (var option of x.notifications) {
            let optionItem: Option = {
              id: option.id,
              name: option.description,
              time: option.modifiedDate,
              title: option.title,
              notificationType: option.notificationType,
              toWhom: option.toWhom,
              transactionId: option.transactionId
            };
            options.push(optionItem);
          }
          item.options = options;
          allLeaves.push(item);
        }

        const LeavesData = <Leaves NOTIFICATIONS={allLeaves} setApiRefresher={setApiRefresher} />;
        setleaveNotifications(LeavesData);
        setLeavesNotificationCount(allLeaves.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetEmployeeNotifications();
      } else {
        window.location.href= base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRefresher]);

  let sum = 0;

  leaveNotifications?.props?.NOTIFICATIONS.forEach((notification: any) => {
    sum += notification.options.length;
  });

  const spanStyle = {
    border: '0.5px solid #eb5757',
    backgroundColor: '#eb5757',
    borderRadius: '3px',
    width: '18px',
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    color: '#fff',
  };

  return (
    <Box
      flex={1}
      // boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
      boxShadow={'4px 4px 4px rgba(9, 44, 76, 0.10)'}
      p={{ xs: 2, md: 2.5 }}
      borderRadius={3}
    >
      <Box
        flexDirection='row'
        alignItems={'center'}
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        {/* <Typography
          variant='h6'
          sx={{ display: { xs: 'none', md: 'block' } }}
          fontWeight={600}
        >
          {t('Leaves')}
        </Typography> */}
        <Typography
          fontSize={16}
          fontWeight={500}
        >
          {t('Leaves')}
        </Typography>

        {/* {props.leavesTaken > 0 && <div style={spanStyle}>{sum}</div>} */}
        <div style={spanStyle}>{sum}</div>
      </Box>

      <Center mt={2} gap={2}>

        {sum > 0 ? (
          <Typography fontWeight={600} mr={'auto'}>
            {leaveNotifications}
          </Typography>
        ) : (
          <Typography fontWeight={500} mr={'auto'}>
            No notifications available
          </Typography>
        )}
      </Center>
    </Box>
  );
};

export default Notifications;
