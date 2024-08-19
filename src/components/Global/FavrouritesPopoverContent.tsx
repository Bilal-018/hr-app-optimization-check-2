import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  PopoverHeader,
  PopoverItem,
  PopoverItemInfoContainer,
} from '../Navigation/Topbar/Notifications/Notifications.styles';
import { RedInquiryIcon, RedMailIcon } from '../../assets/images';
import { useTranslation } from 'react-i18next';

const NOTIFICATIONS = [
  {
    id: 1,
    name: 'Today',
    options: [
      {
        id: 1,
        name: '[HR community] response from @john',
        icon: RedMailIcon,
        time: '2 hours ago',
      },
      {
        id: 2,
        name: 'Update HR module ',
        icon: RedInquiryIcon,
        time: '2 hours ago',
      },
    ],
  },
  {
    id: 2,
    name: '02 Janvier, 2022',
    options: [
      {
        id: 1,
        name: 'Update of Slaeb’s T&C',
        icon: RedMailIcon,
        time: '2 hours ago',
      },
      {
        id: 2,
        name: ' [CRM community] New post',
        icon: RedInquiryIcon,
        time: '2 hours ago',
      },
    ],
  },
];

function FavrouritesPopoverContent() {
  const { t } = useTranslation();
  return (
    <>
      <PopoverHeader>
        {t('Favorites')}
        <Typography className='notification'>4</Typography>
      </PopoverHeader>
      {NOTIFICATIONS.map((item) => (
        <Box key={item.id} sx={{ mt: '21px', ml: '20px' }}>
          <Typography className='extraSmallBody'>{t(item.name)}</Typography>
          <Box>
            {item.options.map((option) => (
              <PopoverItem key={option.id}>
                <img src={option.icon} alt='icon' />
                <PopoverItemInfoContainer>
                  <Typography className='body'>{t(option.name)}</Typography>
                  <Typography className='extraSmallBody'>
                    {option.time}
                  </Typography>
                </PopoverItemInfoContainer>
              </PopoverItem>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}

export default FavrouritesPopoverContent;
