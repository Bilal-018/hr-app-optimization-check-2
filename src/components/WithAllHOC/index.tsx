import React from 'react';
import { CustomThemeProvider } from '../../theme';
import { CssBaseline } from '@mui/material';
import GlobalLoader from '../Global/GlobalLoader';
import { SnackbarProvider } from '../Global/WithSnackbar';

function index({ children }: any) {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <GlobalLoader>
        <SnackbarProvider>{children}</SnackbarProvider>
      </GlobalLoader>
    </CustomThemeProvider>
  );
}

export default index;
