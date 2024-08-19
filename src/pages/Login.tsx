import React, { useState } from 'react';
import { LoginBackground, logo } from '../assets/images';
import { Box } from '@mui/material';
import LoginComponent from '../components/Login/Login';
import TermsAndCondition from '../components/TermsAndCondition/TermsAndCondition';
import FirstTimeLogin from '../components/Login/FirstTimeLogin';

const RenderComponent = ({ step, ...props }: any) => {
  switch (step) {
    case 1:
      return <LoginComponent {...props} />;
    case 2:
      return <TermsAndCondition {...props} />;
    case 3:
      return <FirstTimeLogin {...props} />;
    default:
      return <LoginComponent {...props} />;
  }
};

function Login() {
  const [step, setStep] = useState<any>(1);

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
        <RenderComponent step={step} setStep={setStep} />
      </Box>
    </Box>
  );
}

export default Login;
