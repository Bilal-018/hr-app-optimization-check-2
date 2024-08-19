/* eslint-disable eqeqeq */
import { Box, LinearProgress, Typography } from '@mui/material';
import CircularIcon from './CircularIcon';
import { useTranslation } from 'react-i18next';

const styles = {
  statsContainer: (theme: any) => ({
    flex: 1,
    display: 'flex',
    padding: '24px 12px',
    maxWidth: '492px',
    // border: `1px solid ${theme.palette.common.border}`,
    backgroundColor: theme.palette.background.backLessOps,
    borderRadius: '20px',
    gap: '15px',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      padding: '10px',
    },
  }),
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
};

const StatBox = ({ title, value, icon, color, hideProgress, sx = {} }: any) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={(theme) => ({
        ...styles.statsContainer(theme),
        ...(value == 0 || value == '0' || value == '0%'
          ? {
              filter: 'grayscale(100%)',
              opacity: 0.5,
            }
          : {}),
        ...sx,
      })}
    >
      <CircularIcon icon={icon} color={color} />
      <Box sx={styles.statBox}>
        <Typography
          className=''
          style={{ fontSize: 12, fontWeight: 400 }}
          sx={{
            opacity: 0.7,
          }}
        >
          {t(title)}
        </Typography>
        <Typography style={{ fontSize: 18, fontWeight: 700 }}>
          {t(value) || 0}
        </Typography>
        {!hideProgress && (
          <LinearProgress
            variant='determinate'
            value={20}
            sx={{ borderRadius: 999, maxWidth: '100px' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default StatBox;
