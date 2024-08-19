import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import service from '../../services/loginService';
import {
  confirmPasswordValidation,
  errorHelperText,
} from '../../utils/validation';
import { useSnackbar } from '../Global/WithSnackbar';
import PasswordValidations from '../Global/PasswordValidations';
import PasswordField from '../Global/PasswordField';
import { useTranslation } from 'react-i18next';
import LanguageHeader from './LanguageHeader';

const updateData = {
  newPassword: '',
  oldPassword: '',
  confirmPassword: '',
};

function FirstTimeLogin({ setStep }: any) {
  const [update, setUpdateState] = useState<any>(updateData);
  const [errors, setErrors] = useState<any>({
    password: {
      error: false,
      message: '',
    },
    confirmPassword: {
      error: false,
      message: '',
    },
    oldPassword: {
      error: false,
      message: '',
    },
  });
  const { showMessage }: any = useSnackbar();

  const updateNewPassword = async () => {
    const token = sessionStorage.getItem('token_key');

    const errors = confirmPasswordValidation(
      update.newPassword,
      update.confirmPassword,
      update.oldPassword
    );

    console.log(errors);

    if (
      errors.confirmPassword.error ||
      errors.password.error ||
      errors.oldPassword.error
    ) {
      setErrors({
        ...errors,
      });
      return;
    } else {
      setErrors({
        password: {
          error: false,
          message: '',
        },

        confirmPassword: {
          error: false,
          message: '',
        },

        oldPassword: {
          error: false,
          message: '',
        },
      });
    }

    let url = 'api/Authenticate/ChangePassword';
    let response = await service
      .updateFirsttimePasswordRequest(url, update, token)
      .catch((error) => {
        showMessage(error.message, 'error');
      });

    if (response.status !== 'Success') {
      showMessage(response.message, 'error');
    } else {
      showMessage(response.message, 'success');
      setStep(1);
    }
  };

  const captureLoginData = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;
    // eslint-disable-next-line default-case
    switch (name) {
      case 'newPassword':
        setUpdateState({
          ...update,
          newPassword: value,
        });
        break;
      case 'oldPassword':
        setUpdateState({
          ...update,
          oldPassword: value,
        });
        break;
      case 'confirmPassword':
        setUpdateState({
          ...update,
          confirmPassword: value,
        });
        break;
    }
  };

  const { t } = useTranslation();

  return (
    <Box
      sx={(theme) => ({
        height: 'fit-content',
        width: '100%',
        minHeight: '600px',
        maxWidth: '640px',
        background: theme.palette.background.default,
        borderRadius: '20px',
        ml: '10%',
        mx: { xs: '10%' },
        p: '30px',
      })}
    >
      <LanguageHeader />

      <Box>
        <Stack alignContent='center' justifyContent='center' spacing={2}>
          <Typography
            variant='h3'
            sx={{ mt: 2 }}
            textAlign='center'
            fontWeight='600'
          >
            {t('First connexion')}
          </Typography>

          <Typography
            className='body'
            sx={{ mt: 2, opacity: 0.5 }}
            textAlign='center'
          >
            {t('Must be at least 8 characters')}{' '}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: { md: '80%' },
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <Box>
              <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
                {t('Old Password')}
              </Typography>
              <PasswordField
                name='oldPassword'
                onChange={(e: any) => { captureLoginData(e) }}
                placeholder={t('Enter your old Password')}
              />
              {errorHelperText(t(errors.oldPassword.message))}
            </Box>{' '}
            <Box>
              <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
                {t('New Password')}
              </Typography>
              <PasswordField
                name='newPassword'
                onChange={(e: any) => captureLoginData(e)}
                placeholder={t('Enter your new Password')}
              />
              {errorHelperText(t(errors.password.message))}
            </Box>{' '}
            <Box>
              <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
                {t('Confirm Password')}
              </Typography>
              <PasswordField
                name='confirmPassword'
                onChange={(e: any) => captureLoginData(e)}
                placeholder={t('Enter your new Password')}
              />
              {errorHelperText(t(errors.confirmPassword.message))}
            </Box>
          </Box>
          <PasswordValidations password={update.newPassword} />
          <Button
            variant='contained'
            sx={{
              width: '80%',
              mt: 4,
            }}
            onClick={() => { void updateNewPassword() }}
          >
            {t('Reset Password')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FirstTimeLogin;
