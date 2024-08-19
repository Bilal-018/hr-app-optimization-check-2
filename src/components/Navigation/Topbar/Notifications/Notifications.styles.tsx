import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const PopoverHeader = styled(Typography)(() => ({
  // padding: theme.spacing(2),
  borderBottom: `.5px solid #18a0fb64`,
  paddingBlock: '12px',
  display: 'flex',
  justifyContent: 'flex-start',
}));

export const PopoverItem = styled(Box)(() => ({
  padding: '10px',
  width: '95%',
  '&:hover': {
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));

export const PopoverItemInfoContainer = styled(Box)(({ }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '5px',
}));
