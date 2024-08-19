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

function ProfileInfo() {
  const [EMPLOYEE_INFO, setEmployeeInformation] = useState<any>({});
  const profileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState<any>(null);
  const initialized = useRef(false);
  const [showModal, setShowModal] = useState<any>(false);
  const { showMessage }: any = useSnackbar();

  const { t } = useTranslation();

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
  const empId = sessionStorage.getItem('empId_key');
  const email = sessionStorage.getItem('email_key');
  const base_url = process.env.REACT_APP_BASE_URL;

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

  // const getProfilePictureData = async () => {
  //   let pictureData: any = '';
  //   jwtInterceptor
  //     .get(
  //       'api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
  //         empId +
  //         '&email=' +
  //         email
  //     )
  //     .then((response: any) => {
  //       pictureData = response;
  //     });
  // };

  const uploadProfilePictureData = (formDataFiles: any) => {
    let url = 'api/Employee/UploadProfileImage?EmployeeDetailId=' + empId;
    /* let response = await profileService.uploadDocumentsDataRequest(
      url,
      formDataFiles,
      bearerToken
    );

    if (response) {
      showMessage(response, "success");
    }*/

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
            email: email,
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
        // getProfilePictureData();
        void getProfilePicture();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    console.log(
      'profile pic will be here',
      process.env.REACT_APP_API_PROFILE_SERVICE_URL +
      '/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
      empId +
      '&email=' +
      email
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          spacing={2}
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
                  onChange={handleProfilePicChange}
                  // only accept image files
                  accept='image/*'
                />
              </span>
            </Tooltip>

            {showModal && (
              <BaseModal
                open={showModal}
                handleClose={() => { setShowModal(false) }}
                title='My Portal -  Upload new document'
                showSaveButton={false}
              >
                <Typography classes='smallBody' className='text-ellipsis'>
                  {t('Attachment')}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
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
          <Typography className='smallBody'>
            {EMPLOYEE_INFO.fullName}
          </Typography>
          <Typography className='extraSmallBody'>
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
          <Typography classes='smallBody' className='text-ellipsis'>
            {t('Employee Id')}
          </Typography>

          <Typography
            classes='smallBody'
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis'
          >
            {EMPLOYEE_INFO.employeeId}
          </Typography>
        </Grid>
        {/* End */
        /* Line manager*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Line Manager')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.lineManagerFullName}
          </Typography>
        </Grid>
        {/* End */
        /*Contract Type*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Contract Type')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis smallBody'
          >
            {t(EMPLOYEE_INFO.contractType)}
          </Typography>
        </Grid>
        {/* End */
        /*Joining Date*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Joining Date')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.dateOfJoinig}
          </Typography>
        </Grid>
        {/* End */
        /*Email Address*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Email Address')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.email}
          </Typography>
        </Grid>
        {/* End */
        /*Cost Center*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Cost Center')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
            className='text-ellipsis smallBody'
          >
            {EMPLOYEE_INFO.costCenter}
          </Typography>
        </Grid>
        {/* End */
        /*Department*/}
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
          <Typography className='text-ellipsis smallBody'>
            {t('Department')}
          </Typography>

          <Typography
            sx={{
              opacity: 0.7,
            }}
            fontWeight={400}
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

export default ProfileInfo;
