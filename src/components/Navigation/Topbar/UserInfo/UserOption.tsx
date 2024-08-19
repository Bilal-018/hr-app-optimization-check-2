import {
  FormControlLabel,
  FormGroup,
  Radio,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../../../../theme';
import { themeTypes } from '../../../../theme';

interface UserOptionProps {
  name: string;
  icon: string;
  options: string[];
  onClick?: () => void;
}

const noop = () => { /* do nothing */ };

function UserOption({
  name,
  icon,
  options,
  onClick = noop,
}: UserOptionProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { t } = useTranslation();

  interface ThemeContextValue {
    myTheme: typeof themeTypes.default;
    changeTheme: (themeTo: string) => void;
  }

  const { myTheme, changeTheme } = useContext(themeContext) as ThemeContextValue;
  console.log('myTheme: ', myTheme);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div>
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        justifyContent='start'
        padding='10px 12px'
        sx={(theme) => ({
          borderRadius: '10px',
          cursor: 'pointer',
          '&:hover': {
            //padding: '13px 10px',
            backgroundColor: alpha(theme.palette.info.main, 0.1),
          },
        })}
        onClick={onClick}
      >
        <img src={icon} alt='' />
        <Typography
          variant='body1'
          onClick={() => { setShowOptions((prev) => !prev) }}
        >
          {t(name)}
        </Typography>
      </Stack>
      {showOptions && (
        <FormGroup
          sx={{
            ml: '20px',
          }}
        >
          {matches ? (
            options
              .filter((op) => op !== 'dark')
              .map((option, id) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Radio sx={{ p: 0, py: '4px', pr: '6px' }} size='small' checked={option === myTheme.name} />
                  }
                  label={String(option[0]).toUpperCase() + option.slice(1)}
                  sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                  onClick={() => { changeTheme(option) }}
                />
              ))
          ) : (
            options
              .map((option, id) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Radio sx={{ p: 0, py: '4px', pr: '6px' }} size='small' checked={option === myTheme.name} />
                  }
                  label={option === 'dark' ? `${String(option[0]).toUpperCase() + option.slice(1)} mode` : String(option[0]).toUpperCase() + option.slice(1)}
                  sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                  onClick={() => { changeTheme(option) }}
                />
              ))
          )
          }
        </FormGroup>
      )}
    </div>
  );
}

export default UserOption;
