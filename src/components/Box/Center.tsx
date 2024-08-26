import { Box, BoxProps } from '@mui/material';

const Center = (BoxProps: BoxProps) => {
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
