import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageHeader() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const changeLanguage = (lng: any) => {
    setLang(lng);
    void i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
  };
  return (
    <Box display='flex' alignItems='end' justifyContent='end' gap='10px'>
      <Typography
        className={lang === 'en' ? 'h6' : 'body'}
        sx={{
          borderRight: '1px solid #092c4c5a',
          paddingRight: '10px',
          cursor: 'pointer',
        }}
        onClick={() => { changeLanguage('en') }}
      >
        ENG
      </Typography>
      <Typography
        className={lang === 'fr' ? 'h6' : 'body'}
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => { changeLanguage('fr') }}
      >
        FR
      </Typography>
    </Box>
  );
}

export default LanguageHeader;
