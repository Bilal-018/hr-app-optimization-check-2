import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>{t('404')}</h1>
      <p>{t('Page not found')}</p>
    </Box>
  );
}

export default NotFound;
