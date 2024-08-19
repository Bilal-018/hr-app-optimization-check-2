/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CircularIcon from '../../Global/CircularIcon';
import { useSnackbar } from '../../Global/WithSnackbar';
import jwtInterceptor from '../../../services/interceptors';
import { useTranslation } from 'react-i18next';
import { UserPlaceholder } from '../../../assets/images';
import DragAndDrop from '../../Global/DragAndDrop';
import BaseModal from '../../Global/Modal';
import jwtInterceoptor from '../../../services/interceptors';

function HRProfileInfo() {
  const [EMPLOYEE_INFO, setEmployeeInformation] = useState<any>({});
  const profileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState<any>(null);
  const initialized = useRef(false);
  const [showModal, setShowModal] = useState<any>(false);
  const { showMessage }: any = useSnackbar();

  const { t } = useTranslation();

  const base_url = process.env.REACT_APP_BASE_URL;

  const handleProfilePicUpload = () => {
    if (profileInputRef.current) {
      (profileInputRef.current as HTMLInputElement).click();
    }
  };

  const handleProfilePicChange = (event: any) => {
    if (event.target.files?.[0]) {
      setProfilePic(URL.createObjectURL(event.target.files[0]));
      const formDataFiles = new FormData();
      formDataFiles.append('file', event.target.files[0]);

      uploadProfilePictureData(formDataFiles);
      setShowModal(false);
    }
  };

  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('employee_id_key');

  const getProfileData = () => {
    jwtInterceptor
      .get('api/Employee/GetProfileTopSectionDetials?id=' + empId)
      .then((response: any) => {
        setEmployeeInformation(() => ({
          ...EMPLOYEE_INFO,
          ...response.data,
        }));
      });
  };

  const uploadProfilePictureData = (formDataFiles: any) => {
    let url = 'api/Employee/UploadProfileImage?EmployeeDetailId=' + empId;

    jwtInterceptor.post(url, formDataFiles).then((response: any) => {
      showMessage(response.data, 'success');
    });
  };

  const getProfilePicture = async () => {
    try {
      const response = await jwtInterceoptor.get(
        'api/Employee/GetProfilePictureFileStream',
        {
          params: {
            EmployeeDetailId: empId,
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
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getProfileData();
        void getProfilePicture();
      } else {
        window.location.href = base_url + '/login';
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
        padding: '30px',

        '@media screen and (max-width: 600px)': {
          flexDirection: 'column',
          gap: '10px',
          padding: '10px',
        },
      }}
    >
      <Box
        sx={{
          flex: 0.2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '10px',
          position: 'relative',
          '& img': {
            border: '3px solid #FFFFFF',
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            borderRadius: '50%',
            backgroundColor: '#dbbfec68',
            aspectRatio: '1/1',
            maxWidth: '180px',
            maxHeight: '180px',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          },
        }}
      >
        <img
          src={profilePic}
          alt='profile'
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = UserPlaceholder;
          }}
        />
        <Stack
          alignItems='center'
          justifyContent='center'
          position='relative'
          spacing={1}
        >
          <Box sx={{ position: 'absolute', top: '-25px' }}>
            <Tooltip title={t('Upload Profile Picture')} placement='bottom'>
              <span>
                <CircularIcon
                  icon={<AddIcon />}
                  color='#092C4C'
                  sx={{ width: '25px', height: '25px' }}
                  opacity={0.2}
                  onClick={() => { setShowModal(true) }}
                />
                <input
                  type='file'
                  style={{ display: 'none' }}
                  ref={profileInputRef}
                  onChange={() => void handleProfilePicChange}
                  // only accept image files
                  accept='image/*'
                />
              </span>
            </Tooltip>

            {showModal && (
              <BaseModal
                open={showModal}
                handleClose={() => { setShowModal(false) }}
                title='Profile - Picture'
                showSaveButton={false}
              >
                {/* <Typography classes='smallBody' className='text-ellipsis'>
                  {t('Attachment')}
                </Typography> */}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: 3
                  }}
                >
                  <DragAndDrop
                    sx={{ background: 'white', padding: '20px' }}
                    onChangeFile={handleProfilePicUpload}
                  />

                  <Box
                    sx={{
                      background: '#18A0FB',
                      width: '50%',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '10px',
                    }}
                  >
                    <Typography
                      classes='smallBody'
                      sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      {t('Upload')}
                    </Typography>
                  </Box>
                </Box>
              </BaseModal>
            )}
          </Box>
          <Typography fontSize={14} fontWeight={500}>
            {EMPLOYEE_INFO.fullName}
          </Typography>
          <Typography fontSize={12} fontWeight={500} sx={{ opacity: '0.7' }}>
            {t(EMPLOYEE_INFO.designation)}
          </Typography>
        </Stack>
      </Box>
      <Grid
        container
        sx={{
          flex: 0.8,
        }}
        rowGap={2}
        columnGap={0.5}
        alignContent='flex-start'
      >
        {/* Employee Id */}
        <Grid
          key='1'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography classes='smallBody' className='text-ellipsis' fontSize={14} fontWeight={500}>
            {t('Employee Id')}
          </Typography>

          <Typography
            classes='smallBody'
            fontSize={14} fontWeight={500}
            sx={{
              opacity: 0.7,
            }}
            className='text-ellipsis'
          >
            {EMPLOYEE_INFO.employeeId}
          </Typography>
        </Grid>
        {/* End */
        /* Line manager*/}
        <Grid
          key='2'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Line Manager')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.lineManagerFullName}
          </Typography>
        </Grid>
        {/* End */
        /*Contract Type*/}
        <Grid
          key='3'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Contract Type')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {t(EMPLOYEE_INFO.contractType)}
          </Typography>
        </Grid>
        {/* End */
        /*Joining Date*/}
        <Grid
          key='4'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Joining Date')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.dateOfJoinig}
          </Typography>
        </Grid>
        {/* End */
        /*Email Address*/}
        <Grid
          key='5'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Email Address')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.email}
          </Typography>
        </Grid>
        {/* End */
        /*Cost Center*/}
        <Grid
          key='6'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Cost Center')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.costCenter}
          </Typography>
        </Grid>
        {/* End */
        /*Department*/}
        <Grid
          key='7'
          sm={5.8}
          xs={11.9}
          md={3.95}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography className='text-ellipsis smallBody' fontSize={14} fontWeight={500}>
            {t('Department')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontSize={14} fontWeight={500}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.department}
          </Typography>
        </Grid>
        {/* End */}
      </Grid>
    </Box>
  );
}

export default HRProfileInfo;
