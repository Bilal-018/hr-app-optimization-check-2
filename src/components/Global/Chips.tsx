import { Box, Typography, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function CircularChip({ value, color = '#092C4C', sx, onClick }: any) {
  const { t } = useTranslation();
  return (
    <Typography
      className='smallBody'
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: alpha(color, 0.1),
        color: theme.palette.info.main,
        width: '36px',
        height: '36px',
        marginLeft: '9%',
        ...sx,

        svg: {
          path: {
            fill: color,
          },
        },
      })}
      onClick={onClick}
    >
      {t(value)}
    </Typography>
  );
}

export function RoundedChip({ status, color = '#092C4C', employee , agendaColor = 'grey' }: any) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
      }}
    >
      {employee ? (
        <>
          <Box
            sx={{
              width: '10px',
              height: '10px',
              backgroundColor: agendaColor,
              borderRadius: '100px',
              fontWeight: '500',
            }}
          />

          <Typography
            className='smallBody'
            sx={{
              minWidth: '125px',
            }}
          >
            {t(status)}
          </Typography>
        </>
      ) : (
        <Typography
          className='smallBody'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(color, 0.1),
            color: color,
            padding: '5px 15px',
            borderRadius: '22.5px',
            width: 'fit-content',
            border: `1px solid ${color}`,
            minWidth: '125px',
          }}
        >
          {t(status)}
        </Typography>
      )}
    </Box>
  );
}
