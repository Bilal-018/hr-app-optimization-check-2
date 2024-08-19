import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CircularIcon from '../Global/CircularIcon';
import SchoolIcon from '@mui/icons-material/School';
import { useTranslation } from 'react-i18next';

interface Skill {
  id: number;
  name: string;
  value: number;
  color: string;
}

interface TraineeStatsProps {
  skills: Skill[];
}

function TraineeStats(props: TraineeStatsProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={(theme) => ({
        p: '25px',
        borderRadius: '20px',
        border: `1px solid ${theme.palette.common.black}`,
        minWidth: { md: '490px', xs: '100%' },
      })}
    >
      {props.skills.map((state) => (
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          justifyContent='space-between'
          sx={{
            py: '10px',
            borderBottom: '1px solid rgba(9, 44, 76, 0.10)',
          }}
          key={state.id}
        >
          <Stack direction='row' spacing={1} alignItems='center'>
            <CircularIcon
              color={state.color}
              icon={
                <SchoolIcon
                  sx={{
                    width: '20px',
                    height: '20px',
                  }}
                />
              }
              sx={{ width: '40px', height: '40px' }}
            />
            <Typography
              variant='body1'
              sx={{
                opacity: 0.7,
              }}
            >
              {t(state.name)}
            </Typography>
          </Stack>
          <Typography variant='h5' fontWeight={600}>
            {t(state.value.toString())}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

export default TraineeStats;
