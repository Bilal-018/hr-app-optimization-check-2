import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CircularIcon from '../Global/CircularIcon';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../services/interceptors';
import { AxiosResponse } from 'axios';

interface AnnouncementData {
  description: string;
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
  }, []);

  const getAnnouncementData = async () => {
    try {
      // eslint-disable-next-line
      const response: AxiosResponse<AnnouncementData[]> = await jwtInterceptor.get(
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
