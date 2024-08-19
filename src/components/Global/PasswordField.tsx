import React, { useState } from 'react';
import { SearchBar } from '../Navigation/Topbar/Topbar.styles';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function PasswordField(props: any) {
  const [showPassword, setSetShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setSetShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <SearchBar
      variant='outlined'
      type={showPassword ? 'text' : 'password'}
      sx={{
        width: '100%',
        maxWidth: '100%',
        pl: 3,
        ml: 0,
        mt: 1,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export default PasswordField;
