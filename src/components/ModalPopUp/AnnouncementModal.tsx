import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const style = {
  modalWrapper: (theme: any) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    backgroundColor: theme.palette.background.default,
    padding: '20px',
    maxWidth: '620px',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
  }),
};

function AnnouncementModal({
  open,
  handleClose,
  children,
  title = 'Announcements',
  sx = { width: '90%' },
  isCloseIcon = true,
  hideTitle = false,
}: any) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={(theme) => ({
          ...style.modalWrapper(theme),
          ...sx,
        })}
      >
        <Box className='f-b-c'>
          {!hideTitle && <Typography variant='h5'>{t(title)}</Typography>}
          {isCloseIcon && (
            <Box
              className='action-icon-rounded'
              sx={{
                svg: {
                  fill: (theme) => theme.palette.info.main,
                },
              }}
            >
              <Button onClick={handleClose} sx={{
                background: (theme) => theme.palette.grey[200]
              }}>
                <CloseIcon />
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            mt: '30px',
            mb: '20px',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
        <Box
          className='f-e-c'
          sx={{
            gap: '20px',
          }}
        ></Box>
      </Box>
    </Modal>
  );
}

export default AnnouncementModal;
