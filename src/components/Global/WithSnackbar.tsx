import { Alert, Slide, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SnackbarContext: any = createContext('');

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const SnackbarProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Something went wrong!');
  const [duration, setDuration] = useState(2000);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [severity, setSeverity] = useState('success');

  const { t } = useTranslation();

  const showMessage = (
    message = 'something went wrong',
    severity: AlertSeverity = 'success',
    duration = 2000
  ) => {
    setMessage(message);
    setSeverity(severity);
    setDuration(duration);
    setOpen(true);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const value = {
    showMessage,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={duration}
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        sx={{
          '.MuiPaper-root': {
            py: 1.5,
            px: 3.5,
            borderRadius: 3,
            color: 'white',
            alignItems: 'center',

            svg: {
              fontSize: '28px',
            },

            button: {
              svg: {
                marginBottom: '3px',
              },
            },
          },
        }}
      >
        <Alert
          variant='filled'
          // onClose={handleClose}
          severity={severity as AlertSeverity}
          sx={{
            '.MuiAlert-message': {
              fontSize: '1.2rem',
            },
          }}
        >
          {t(message)}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
