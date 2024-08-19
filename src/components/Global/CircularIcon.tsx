import { Box, alpha } from '@mui/material';
import React from 'react';

const noop = () => { /* do nothing */ };

function CircularIcon({
  icon,
  color,
  sx = {},
  onClick = noop,
  opacity = 0.1,
}: any) {
  return (
    <Box
      sx={{
        padding: '12px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: alpha(color, opacity),
        svg: {
          color: { color },
        },
        ...sx,
        ...(onClick && {
          cursor: 'pointer',
        }),
      }}
      onClick={onClick}
    >
      {icon}
    </Box>
  );
}

export default CircularIcon;
