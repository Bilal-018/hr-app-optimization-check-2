import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CircularIcon from '../Global/CircularIcon';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../services/interceptors';

interface AnnouncementData {
  description: string;
  // Add other properties as needed
}

function Announcements() {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState<AnnouncementData[]>([]);
  const initialized = useRef<boolean>(false);
  const bearerToken = sessionStorage.getItem('token_key');

  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        void getAnnouncementData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAnnouncementData = async () => {
    try {
      const response = await jwtInterceptor.get(
        'api/Anouncement/GetActiveAnnouncement'
      );
      setAnnouncement(response.data);
    } catch (error) {
      console.error('Error fetching announcement data:', error);
    }
  };

  return (
    <>
      <Box
        sx={() => ({
          borderRadius: '20px',
          // background: theme.palette.background.backLessOps,
          p: '15px',
        })}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Stack direction='row' spacing={1} alignItems='center'>
            <CircularIcon icon={<AnnouncementIcon />} color='#E2B93B' />
            <Typography className='body'>{t('Announcements')}</Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            p: 2,
          }}
        >
          {announcement.length > 0 && (
            <Typography className='extraSmallBody'>
              {announcement[0].description}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Announcements;
