import React from 'react';
import { Typography } from '@mui/material';
import AnnouncementModal from './AnnouncementModal';
import TextIcon from '../Icon/TextIcon';
import { customColor } from '../../theme/customColor';

const AnnouncementPopup = ({ open, handleClose, announcementData }: any) => {
  return (
    <AnnouncementModal
      title='Announcement'
      handleClose={handleClose}
      open={open}
    >
      {/* <Grid item xs={12}>
                <Center gap={1} mt={1} sx={{ justifyContent: "flex-start" }}>
                    <Typography
                        variant="SmallBody"
                        sx={{ lineHeight: "normal" }}
                        mt={4}
                    >
                        {announcementData?.description}
                    </Typography>
                </Center>
            </Grid> */}
      <div style={{ display: 'block', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TextIcon
            icon='ph:chats-circle-fill'
            color='#E2B93B'
            size={40}
            fontSize={22}
          />
          <Typography fontWeight={500} fontSize={14}>
            {announcementData?.title}
          </Typography>
        </div>

        <div>
          <Typography
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            variant='caption'
            color={customColor.light_text}
          >
            <b>Posted: </b> {announcementData?.startDate}
          </Typography>

          <div>
            <Typography
              sx={{ lineHeight: 'normal', fontSize: '14px', textAlign: 'left' }}
            >
              {announcementData?.description}
            </Typography>
          </div>
        </div>
      </div>
    </AnnouncementModal>
  );
};

export default AnnouncementPopup;
