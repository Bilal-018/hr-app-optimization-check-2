import { Icon } from '@iconify/react/dist/iconify.js';
import { Box, alpha } from '@mui/material';
import React from 'react';

const TextIcon = ({ icon, sx, fontSize, size, color }: any) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        bgcolor: alpha(color || '#000', 0.15),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        ...sx,
      }}
    >
      <Icon color={color} fontSize={fontSize} icon={icon} />
    </Box>
  );
};

export default TextIcon;
