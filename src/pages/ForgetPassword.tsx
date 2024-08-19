/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useReducer, useState } from 'react';
import { LoginBackground, logo } from '../assets/images';
import { Box, Button, Stack, Typography } from '@mui/material';
import { SearchBar } from '../components/Navigation/Topbar/Topbar.styles';
import service from '../services/loginService';
import { useNavigate } from 'react-router-dom';
import {
  errorHelperText,
  isValidateEmail,
  validatePassword,
} from '../utils/validation';
import PasswordValidations from '../components/Global/PasswordValidations';
import { useSnackbar } from '../components/Global/WithSnackbar';
import PasswordField from '../components/Global/PasswordField';
import { useTranslation } from 'react-i18next';
import LanguageHeader from '../components/Login/LanguageHeader';

const RenderComponent = ({ step, state, dispatch, error, ...props }: any) => {
  const { t } = useTranslation();
  switch (step) {
    case 1:
      return (
        <Box>
          <Typography
            className='body'
            fontWeight={500}
            sx={{ mb: 1 }}
            onChange={(e: any) =>
              dispatch({ type: 'costcenter', value: e.target.value })
            }
          >
            {t('Email')}
          </Typography>
          <SearchBar
            variant='outlined'
            placeholder={t('Enter your email address').toString()}
            name='email'
            value={state.email}
            sx={{
              width: '100%',
              maxWidth: '100%',
              pl: 3,
              ml: 0,
              mt: 1,
            }}
            onChange={(e: any) =>
              dispatch({ type: 'email', value: e.target.value })
            }
          />
          {errorHelperText(t(error.email.message))}
        </Box>
      );
    case 2:
      return (
        <Box>
          <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
            {t('Token')}
          </Typography>
          <SearchBar
            variant='outlined'
            placeholder={t('Enter your token').toString()}
            name='emailToken'
            sx={{
              width: '100%',
              maxWidth: '100%',
              pl: 3,
              ml: 0,
              mt: 1,
            }}
            value={state.emailToken}
            onChange={(e: any) =>
              dispatch({ type: 'emailToken', value: e.target.value })
            }
          />
          {errorHelperText(t(error.emailToken.message))}
        </Box>
      );
    case 3:
      return (
        <>
          <Box>
            <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
              {t('Password')}
            </Typography>
            <PasswordField
              name='password'
              value={state.newPassword}
              onChange={(e: any) =>
                dispatch({ type: 'newPassword', value: e.target.value })
              }
            />
            {errorHelperText(t(error.newPassword.message))}
          </Box>
          <Box>
            <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
              {t('Confirm Password')}
            </Typography>
            <PasswordField
              name='password'
              value={state.confirmPassword}
              onChange={(e: any) =>
                dispatch({ type: 'confirmPassword', value: e.target.value })
              }
            />
            {errorHelperText(t(error.confirmPassword.message))}
          </Box>
          <PasswordValidations password={state.newPassword} />
        </>
      );
    default:
      return 'Not Found';
  }
};

const initialState = {
  newPassword: '',
  confirmPassword: '',
  email: '',
  emailToken: '',
};

function ForgetPassword() {
  const [step, setStep] = useState<any>(1);
  const [error, seterror] = useState<any>({
    email: {
      error: false,
      message: '',
    },
    emailToken: {
      error: false,
      message: '',
    },
    newPassword: {
      error: false,
      message: '',
    },
    confirmPassword: {
      error: false,
      message: '',
    },
  });
  const navigate = useNavigate();
  const { showMessage }: any = useSnackbar();

  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case 'newPassword':
        return { ...prevState, newPassword: action.value };
      case 'confirmPassword':
        return { ...prevState, confirmPassword: action.value };
      case 'email':
        return { ...prevState, email: action.value };
      case 'emailToken':
        return {
          ...prevState,
          emailToken: action.value,
        };
      case 'reset':
        return initialState;
      default:
        throw new Error();
    }
  }, initialState);

  const { t } = useTranslation();
  const base_url = process.env.REACT_APP_BASE_URL;

  const messages = [
    {
      title: t('Forgot password?'),
      description: t('No worries, we’ll send you our reset instructions'),
    },
    {
      title: t('Password reset'),
      description: t(
        'We have sent a code to our reset instructions to your email address'
      ),
    },
    {
      title: t('Set new password'),
      description: t('Must be at least 8 characters'),
    },
  ];

  const updateforgetPassword = async () => {
    let url = 'api/Authenticate/ResetPassword';
    let response = await service
      .updateforgetPasswordRequest(url, state)
      .catch((err) => {
        showMessage(err.message, { variant: 'error' });
      })
      .then((res) => {
        showMessage(res.message, 'success');
        window.location.replace(base_url + '/login');
      });
  };

  const getToken = async () => {
    let url = 'api/Authenticate/ForgetPassword?Email=' + state.email;
    let response = await service
      .getTokenrequest(url, state)
      .catch((err) => {
        showMessage(err.message, { variant: 'error' });
      })
      .then((res) => {
        setStep(2);
      });
  };

  const validate = () => {
    switch (step) {
      case 1:
        if (isValidateEmail(state.email) === false) {
          seterror({
            ...error,
            email: {
              error: true,
              message: t('Email is invalid'),
            },
          });
          return false;
        }

        return true;
      case 2:
        if (state.emailToken === '') {
          seterror({
            ...error,
            emailToken: {
              error: true,
              message: t('Token is required'),
            },
          });
          return false;
        }

        return true;
      case 3:
        const newPassword = validatePassword(state.newPassword);
        if (newPassword.error) {
          seterror({
            ...error,
            newPassword: {
              error: true,
              message: t('Password is required'),
            },
          });
          return false;
        }
        if (state.newPassword !== state.confirmPassword) {
          seterror({
            ...error,
            confirmPassword: {
              error: true,
              message: t('Password and Confirm Password must be same'),
            },
          });
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const forgetPassword: any = () => {
    if (!validate()) return;
    setStep(step === 3 ? 1 : step + 1);

    if (step === 1) getToken();
    else if (step === 3) updateforgetPassword();
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        background: `url(${LoginBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
      }}
    >
      <img
        src={logo}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 150,
        }}
        alt='logo'
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.25)',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        <Box
          sx={(theme) => ({
            height: 'fix-content',
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

          <Stack gap={2}>
            <Typography
              variant='h3'
              sx={{ mt: 2 }}
              textAlign='center'
              fontWeight='600'
            >
              {messages[step - 1].title}
            </Typography>
            <Typography
              className='body'
              sx={{ opacity: '0.5', fontWeight: '400' }}
              textAlign='center'
              fontWeight='600'
            >
              {messages[step - 1].description}
            </Typography>
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
                <RenderComponent
                  step={step}
                  state={state}
                  dispatch={dispatch}
                  error={error}
                />
              </Box>
              <Button
                variant='contained'
                sx={{
                  width: '80%',
                  mt: 4,
                }}
                onClick={() => forgetPassword(step)}
              >
                {step === 2 ? t('Continue') : t('Reset Password')}
              </Button>
              {step === 2 && (
                <Stack alignItems='center' mt={2} gap={1}>
                  <Typography className='body'>
                    {t('Didn’t receive the email ?')}
                  </Typography>
                  <Typography
                    className='body'
                    color='primary'
                    sx={{
                      textDecoration: 'underline',
                    }}
                  >
                    {t('Click here to resend')}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgetPassword;
