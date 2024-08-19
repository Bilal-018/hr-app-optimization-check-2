/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import BaseModal from '../../Global/Modal';
import { UserImage } from '../../Navigation/Topbar/UserInfo/UserInfo';
import { useTranslation } from 'react-i18next';

const maxRange = 6;
// const initialState = {
//   skill: '',
//   expertise: '',
//   score: '',
//   percentage: '',
//   lstSkillEmployeeDetail: [],
// };

function SkillDistribution({ open, setOpen, handelUserClick, state }: any) {
  const [range, setRange] = useState<any>(0);
  const [pictures, setPictures] = useState<any>(state);
  const { t }: any = useTranslation();
  const email = sessionStorage.getItem('email_key');
  const noop = () => { /* do nothing */ };
  
  return (
    <BaseModal
      open={open}
      handleClose={() => setOpen(false)}
      onSave={noop}
      title='Skills Management - Detail view'
      showSaveButton={false}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography className='SmallBody'>{t('Skill')}</Typography>
          <TextField value={state?.skill} disabled />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className='SmallBody'>{t('Expertise')}</Typography>
          <TextField value={state?.expertise} disabled />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className='SmallBody'>{t('Score Achieved')}</Typography>
          <Stack direction='row' alignItems='center' gap={1} mt={1}>
            {[...Array(maxRange)].map((num, i) => (
              <Typography
                sx={{
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid',
                  width: '35px',
                  height: '35px',
                  borderColor: (theme) => theme.palette.common.black,
                  cursor: 'pointer',
                  ...(state?.achievedScore === i
                    ? {
                        backgroundColor: (theme) =>
                          theme.palette.background.paper,
                      }
                    : {}),
                }}
                //value={state?.achievedScore}
                onClick={() => { setRange(i) }}
              >
                {i}
              </Typography>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className='SmallBody'>{t('Percentage')}</Typography>
          <div>
            <Typography fontSize={27} color='primary' fontWeight={500}>
              {state?.percentage}
            </Typography>
          </div>
        </Grid>{' '}
        <Grid item xs={12} md={6}>
          <Typography className='SmallBody'>{t('Members')}</Typography>
          <Stack gap={1} direction='row' alignItems='center' mt={1}>
            {state?.lstSkillEmployeeDetails.map((item: any) => (
                <div onClick={() => handelUserClick(item.employeeDetailId)}>
                  <UserImage
                    userPicture={
                      process.env.REACT_APP_API_PROFILE_SERVICE_URL +
                      '/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
                      item.employeeDetailId +
                      '&email=' +
                      email
                    }
                  />
                </div>
              ))}
          </Stack>
        </Grid>
      </Grid>
    </BaseModal>
  );
}

export default SkillDistribution;
