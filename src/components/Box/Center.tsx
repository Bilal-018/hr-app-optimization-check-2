import { Box } from '@mui/material';
import React from 'react';
const Center = (BoxProps: any) => {
  const { sx, ...rest } = BoxProps;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
      {...rest}
    />
  );
};
export default Center;
