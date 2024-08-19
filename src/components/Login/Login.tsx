import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../Navigation/Topbar/Topbar.styles';
import service from '../../services/loginService';
import { useSnackbar } from '../Global/WithSnackbar';
import { errorHelperText, validateLogin } from '../../utils/validation';
import PasswordField from '../Global/PasswordField';
import { useTranslation } from 'react-i18next';
import LanguageHeader from './LanguageHeader';

const loginData = {
  email: '',
  password: '',
};

function Login({ setStep }: any) {
  const [login, setLoginState] = useState(loginData);

  const [errors, setErrors] = useState({
    email: {
      error: false,
      message: '',
    },
    password: {
      error: false,
      message: '',
    },
  });

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { showMessage }: any = useSnackbar();

  const validateLoginUser = async () => {
    const { email, password } = validateLogin(login);
    if (email.error || password.error) {
      setErrors({
        email: {
          error: email.error,
          message: email.message,
        },
        password: {
          error: password.error,
          message: password.message,
        },
      });
      return;
    } else {
      setErrors({
        email: {
          error: false,
          message: '',
        },
        password: {
          error: false,
          message: '',
        },
      });
    }

    let url = 'api/Authenticate/Login';
    let response = await service.validateLoginUserRequest(url, login);

    if (response.status) {
      showMessage(response.message, 'error');
    }

    if (response.statusCode === 200) {
      sessionStorage.setItem('token', JSON.stringify(response));
      sessionStorage.setItem('token_key', response.token);
      sessionStorage.setItem(
        'fullname',
        response.employeedetail.firstName +
          ' ' +
          response.employeedetail.lastName
      );
      sessionStorage.setItem('roles', response.userRoles);
      sessionStorage.setItem(
        'empId_key',
        response.employeedetail.employeeDetailId
      );
      sessionStorage.setItem('email_key', response.employeedetail.email);

      if (response.isUserFirstLogin) {
        setStep(3);
        showMessage(
          t('You are logging as First Time User:') + response.isUserFirstLogin,
          'info'
        );
      } else {
        navigate('/')
      }
    } else {
      navigate('/login')
    }
  };

  const captureLoginData = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case 'email':
        setLoginState({
          ...login,
          email: value,
        });
        break;
      case 'password':
        setLoginState({
          ...login,
          password: value,
        });
        break;
    }
  };

  const singInBtnRef: any = React.useRef(null);

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
        <Typography
          variant='h3'
          sx={{ mt: 2 }}
          textAlign='center'
          fontWeight='600'
        >
          {t('Welcome')}
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
            <Box>
              <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
                {t('Email')}
              </Typography>
              <SearchBar
                variant='outlined'
                placeholder={t('Enter your email address').toString()}
                name='email'
                onChange={(e) => { captureLoginData(e) }}
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  pl: 3,
                  ml: 0,
                  mt: 1,
                }}
                onKeyPress={(e: any) => {
                  if (e.key === 'Enter') {
                    singInBtnRef.current.click();
                  }
                }}
              />
              {errorHelperText(t(errors.email.message))}
            </Box>{' '}
            <Box>
              <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
                {t('Password')}
              </Typography>
              <PasswordField
                onChange={(e: any) => { captureLoginData(e) }}
                placeholder={t('Enter your Password')}
                name='password'
                onKeyPress={(e: any) => {
                  if (e.key === 'Enter') {
                    singInBtnRef.current.click();
                  }
                }}
              />
              {errorHelperText(t(errors.password.message))}
              <Typography
                className='body'
                display='block'
                textAlign='end'
                mt={1}
                mr={2}
                sx={{ cursor: 'pointer' }}
                onClick={() => { navigate('/forget-password') }}
              >
                {t('Forgot Password ?')}
              </Typography>
            </Box>
          </Box>
          <Button
            variant='contained'
            sx={{
              width: '80%',
              mt: 4,
            }}
            ref={singInBtnRef}
            onClick={() => void validateLoginUser()}
          >
            {t('Sign In')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
