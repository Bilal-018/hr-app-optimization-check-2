import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const showTickOrCross = (value: any) => {
  return value ? (
    <span style={{ color: 'green' }}>&#10003;</span>
  ) : (
    <span style={{ color: 'red' }}>&#10005;</span>
  );
};

function PasswordValidations({ password = '' }) {
  const isCapitalLetter = password.match(/[A-Z]/g);
  const isNumber = password.match(/[0-9]/g);
  const isSpecialCharacter = password.match(
    // eslint-disable-next-line no-useless-escape
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g
  );
  const isLength8 = password.length >= 8;
  const { t } = useTranslation();
  return (
    <Stack direction='column' gap={1}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography className='body' fontWeight={600} sx={{ mb: 1 }}>
          {t('Password must contain:')}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
          {showTickOrCross(isCapitalLetter)} {t('Capital letter')}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
          {showTickOrCross(isNumber)} {t('Number')}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
          {showTickOrCross(isSpecialCharacter)} {t('Special character')}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography className='body' fontWeight={500} sx={{ mb: 1 }}>
          {showTickOrCross(isLength8)} {t('Length 8')}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PasswordValidations;
