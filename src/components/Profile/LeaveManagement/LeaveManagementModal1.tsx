/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import BaseModal from '../../Global/Modal';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BasicTabs from '../../Global/BasicTabs';
import { Box } from '@mui/system';
import EnhancedTable from '../../Global/Table';
import { useTranslation } from 'react-i18next';
import jwtInterceoptor, { jwtLeave } from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import { UserImage } from '../../Navigation/Topbar/UserInfo/UserInfo';
import { UserPlaceholder } from '../../../assets/images';

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;

function LeaveManagementModal1({
  open,
  handleClose,
  title,
  onSave,
  data,
  leaveDetailId,
  selectedStatus1,
}: any) {
  const { showMessage }: any = useSnackbar();

  // const [leaveTypes, setLeaveTypes] = useState([]);
  const [comments, setComments] = useState('');
  const [managerComment, setManagerComment] = useState('');
  const { t } = useTranslation();
  const [leaveDetail, setLeaveDetail] = useState(
    data || {
      firstName: '',
      lastName: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: '',
      employeeComments: '',
      managerComment: '',
      leaveStatus: '',
    }
  );

  const [EMPLOYEE_INFO, setEmployeeInformation] = useState<any>({});
  const [profilePic, setProfilePic] = useState<any>(null);

  const [scheduleData, setScheduleData] = useState<any>([]);
  const empId = sessionStorage.getItem('empId_key');
  const email = sessionStorage.getItem('email_key');

  const handleCommentsChange = (event: any) => {
    setComments(event.target.value);
    setManagerComment(event.target.value);
  };

  const getConflictData = async () => {
    try {
      const response = await jwtLeave.get(
        `api/LeaveManager/GetScheduleConflict?LeaveDetailId=${leaveDetailId}&LineManagerId=${empId}`
      );
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  const getLeaveDetail = () => {
    let url =
      `api/EmployeeLeave/GetLeaveDetailById?leaveDetailId=` + leaveDetailId;
    jwtLeave
      .post(url)
      .then((response) => {
        if (response.status === 200) {
          response.data.leaveStatus = selectedStatus1;
          setLeaveDetail(response.data);
          if (response.data.managerComment) {
            setComments(response.data.managerComment);
          }
          return response.data;
        } else {
          throw new Error('Failed to fetch leave detail');
        }
      })
      .catch((error) => {
        console.error('Error fetching leave detail:', error);
        throw error;
      });
  };

  // const validate = (values: any) => {
  //   let errors = {
  //     leaveStatus: false,
  //   };
  //   if (!values.leaveStatus || values.leaveStatus === '') {
  //     errors.leaveStatus = true;
  //   }

  //   return errors;
  // };

  const rows = scheduleData.map((item: any) =>
    createData(
      `${item.firstName} ${item.lastName}`,
      new Date(item.startDate).toLocaleDateString('en-GB'),
      new Date(item.endDate).toLocaleDateString('en-GB'),
      item.totalDays,
      `${item.firstName} ${item.lastName}`,
      item.employeeDetailId
    )
  );

  const profilePictures = scheduleData.map((employee: any) => employee.employeeProfilePicture);

  function createData(
    user: any,
    startDate: any,
    endDate: any,
    totalDays: any,
    name: any,
    employeeDetailId: any
  ) {
    return {
      user: (
        <Stack direction='row' gap={2} alignItems='center'>
          <UserImage
            userPicture={
              `${API_URL}/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=` +
              employeeDetailId +
              '&email=' +
              email
            }
          />
          <Typography className='smallBody'>{name}</Typography>
        </Stack>
      ),

      startDate,
      endDate,
      noOfDays: (
        <Typography
          sx={{
            color: '#E2B93B',
            fontWeight: '600',
            fontSize: '24px',
            textAlign: 'center',
          }}
          fontSize={18}
        >
          {totalDays}
        </Typography>
      ),
    };
  }
  function handleCancel() {
    handleClose();
    setComments('');
  }
  const [selectedStatus, setSelectedStatus] = useState(null);
  useEffect(() => {
    setSelectedStatus(leaveDetail.leaveStatus);
  }, [leaveDetail.leaveStatus]);

  const handleStatusChange = (status: any) => {
    setSelectedStatus(status);
    setErrors((prevErrors) => ({
      ...prevErrors,
      leaveStatus: false,
    }));
  };

  const [errors, setErrors] = useState({
    leaveStatus: false,
  });

  const handleSave = () => {
    if (selectedStatus === null || selectedStatus === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        leaveStatus: true,
      }));
      return;
    }

    if (selectedStatus === 'Approved') {
      onSave('Approved', leaveDetailId, managerComment);
      showMessage('Leave is Approved successfully.', 'success');
    } else if (selectedStatus === 'Rejected') {
      onSave('Rejected', leaveDetailId, managerComment);
      showMessage('Leave is Rejected Successfully.', 'success');
    }

    handleClose();
    // getLeaveDetail();
  };

  const headCells = [
    {
      id: 'firstName lastName',
      label: 'User',
    },
    {
      id: 'startDate',
      label: 'Starting Date',
    },
    {
      id: 'endDate',
      label: 'End date',
    },
    {
      id: 'totalDays',
      label: 'No. of days',
    },
  ];

  const getProfileData = async () => {
    jwtInterceoptor
      .get('api/Employee/GetProfileTopSectionDetials?id=' + leaveDetail.employeeDetailId)
      .then((response: any) => {
        setEmployeeInformation((item: any) => ({
          ...EMPLOYEE_INFO,
          ...response.data,
        }));
      });
  };

  const getProfilePicture = async () => {
    try {
      const response = await jwtInterceoptor.get(
        'api/Employee/GetProfilePictureFileStream',
        {
          params: {
            EmployeeDetailId: leaveDetail.employeeDetailId,
            email: EMPLOYEE_INFO.email,
          },
          responseType: 'arraybuffer',
        }
      );

      const uint8Array = new Uint8Array(response.data);
      let binaryString = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64String = btoa(binaryString);
      setProfilePic(`data:image/jpeg;base64,${base64String}`);
    } catch (error) {
      setProfilePic(UserPlaceholder);
    }
  };

  useEffect(() => {
    if (leaveDetailId) {
      getLeaveDetail();
    }
  }, [leaveDetailId, empId])

  useEffect(() => {
    if (leaveDetail.employeeDetailId) {
      void getConflictData();
      getProfileData();
      setComments(leaveDetail.managerComment);
    }
  }, [leaveDetail]);

  useEffect(() => {
    getProfilePicture();
  }, [EMPLOYEE_INFO])

  return (
    <BaseModal
      open={open}
      handleClose={handleCancel}
      title={title}
      onSave={handleSave}
      sx={{
        maxWidth: 'fit-content',
      }}
    >
      <BasicTabs
        tabs={['Summary', 'Schedule']}
        tabPanels={[
          <Grid
            container
            spacing={2}
            sx={{
              maxWidth: '620px',
            }}
          >
            <Grid item xs={12}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('Employee')}
              </Typography>

              <Box
                sx={{
                  color: '#1E242A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  margin: '10px 0',
                  '& img': {
                    borderRadius: '50%',
                    aspectRatio: '1/1',
                    maxWidth: '40px',
                    maxHeight: '40px',
                    objectFit: 'cover',
                  },
                }}
              >
                <img src={profilePic} alt='profile' />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Typography className='SmallBody'>
                    {t(leaveDetail.firstName)}
                  </Typography>

                  <Typography className='SmallBody'>
                    {t(leaveDetail.lastName)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('Leave')}
              </Typography>

              <TextField
                variant='outlined'
                value={leaveDetail.leaveType}
                disabled
                sx={{
                  border: '1px solid #E0E0E0',
                  background: 'transparent !important',
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('Starting date')}
              </Typography>

              <Box mt={1}>
                <Typography className='SmallBody'>
                  {' '}
                  {new Date(leaveDetail.startDate).toLocaleDateString('en-GB')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('End date')}
              </Typography>

              <Box mt={1}>
                <Typography className='SmallBody'>
                  {' '}
                  {new Date(leaveDetail.endDate).toLocaleDateString('en-GB')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('No. of Days')}
              </Typography>

              <Box mt={1}>
                <Typography
                  className='SmallBody'
                  fontWeight={600}
                  color='#E2B93B'
                  fontSize={18}
                >
                  {leaveDetail.totalDays}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography
                className='SmallBody'
                sx={{
                  color: '#092C4C',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {t('Employee Comments')}
              </Typography>

              <TextField
                variant='outlined'
                value={leaveDetail.employeeComments}
                disabled
                fullWidth
                multiline
                rows={2}
                sx={{
                  border: '1px solid #E0E0E0',
                  background: 'transparent !important',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className='SmallBody'>{t('Leave Status')}</Typography>
              <Stack direction='row' gap='5px' alignItems='center'>
                <FormControlLabel
                  label={t('Reject')}
                  control={
                    <Checkbox
                      color='error'
                      checked={selectedStatus === 'Rejected'}
                      onChange={() => handleStatusChange('Rejected')}
                    />
                  }
                />

                <FormControlLabel
                  label={t('Approve')}
                  control={
                    <Checkbox
                      color='success'
                      checked={selectedStatus === 'Approved'}
                      onChange={() => handleStatusChange('Approved')}
                    />
                  }
                />
              </Stack>
              {errors.leaveStatus && (
                <Typography variant='caption' color='error'>
                  Leave Status is required
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span>Potential schedule conflict</span>

                {scheduleData?.length ? <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {profilePictures.slice(0, 3).map((picture: any, index: any) => (
                    <img
                      key={index}
                      style={{
                        height: '50px',
                        width: '50px',
                        borderRadius: '100%',
                        objectFit: 'cover',
                      }}
                      src={`data:image/jpeg;base64,${picture}`}
                      alt='employee'
                    />
                  ))}

                  {profilePictures.length > 3 && (
                    <Box
                      sx={{
                        background: '#18A0FB',
                        height: '24px',
                        width: '40px',
                        borderRadius: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                      }}
                    >
                      {profilePictures.length - 3}+
                    </Box>
                  )}
                </Box> : <></>}

                <span
                  style={{
                    color: '#18A0FB',
                    fontSize: '14px',
                  }}
                >
                  {scheduleData?.length} employees
                </span>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography className='SmallBody'>{t('Comments')}</Typography>

              <TextField
                variant='outlined'
                value={comments}
                fullWidth
                multiline
                rows={3}
                placeholder='Insert notes here'
                onChange={handleCommentsChange}
                sx={{
                  border: 'none !important',
                  background: '#F7F8FB !important',
                  outline: 'none !important',
                }}
              />
            </Grid>
          </Grid>,
          <EnhancedTable head={headCells} rows={rows} />,
        ]}
        customTabPanelSx={{
          maxHeight: '600px',
        }}
      />
    </BaseModal>
  );
}

export default LeaveManagementModal1;
