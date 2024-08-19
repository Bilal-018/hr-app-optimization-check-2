import { Box, Button, Modal, Typography, alpha } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const style = {
  modalWrapper: () => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    backgroundColor: 'white',
    padding: '20px',
    maxWidth: '620px',
    width: '100%',
    // maxHeight: '92vh',
    // overflowY: 'auto',
  }),
  cancelBtn: (theme: any) => ({
    fontWeight: 500,
    fontSize: '14px',
    padding: '15px 40px',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    borderRadius: '10px',
    boxShadow: 'none',
    width: 'fit-content',
    m: 0,

    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  }),
  saveBtn: (theme: any) => ({
    fontWeight: 500,
    fontSize: '14px',
    padding: '15px 40px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
    boxShadow: 'none',
    width: 'fit-content',
    m: 0,

    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
  }),
};

interface BaseModalProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  onSave?: (data: any) => void;
  title?: any;
  yesOrNo?: boolean;
  showSaveButton?: boolean;
  sx?: object;
  isCloseIcon?: boolean;
  hideTitle?: boolean;
  uploadLoading?: boolean;
  bankHoliday?: any;
  skillTypeData?: any;
  type?: string;
}

function BaseModal({
  open,
  handleClose,
  children,
  onSave,
  title = 'New Leave Request',
  yesOrNo = false,
  showSaveButton = true,
  sx = {},
  isCloseIcon = true,
  hideTitle = false,
  uploadLoading = false,
}: BaseModalProps) {
  const { t } = useTranslation();

  const [width, setWidth] = useState(620);
  const [height, setHeight] = useState(660);
  const [isResizing, setIsResizing] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialMouseY, setInitialMouseY] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);

  const resetModalSize = () => {
    setWidth(620);
    setHeight(660);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setInitialMouseX(event.clientX);
    setInitialMouseY(event.clientY);
    setInitialWidth(width);
    setInitialHeight(height);
    setIsResizing(true);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setInitialMouseX(event.touches[0].clientX);
    setInitialMouseY(event.touches[0].clientY);
    setInitialWidth(width);
    setInitialHeight(height);
    setIsResizing(true);
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isResizing) {
      const newWidth = initialWidth + (event.touches[0].clientX - initialMouseX);
      const newHeight = initialHeight + (event.touches[0].clientY - initialMouseY);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleTouchEnd = () => {
    setIsResizing(false);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isResizing) {
      const newWidth = initialWidth + (event.clientX - initialMouseX);
      const newHeight = initialHeight + (event.clientY - initialMouseY);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isResizing]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        resetModalSize();
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={(theme) => ({
          ...style.modalWrapper(),
          ...sx,
          background: theme.palette.mode === 'light' ? 'white' : '#2b2d3e',
          outline: 'none',
          ...(title === 'Presentation - Preview' && {
            resize: 'both',
            overflow: 'auto',
            width: `${width}px`,
            height: `${height}px`,
            // [theme.breakpoints.up('lg')]: { maxWidth: '65vw' },
            minWidth: '50vw',
            maxWidth: 'none',
          }),
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
              <Button onClick={() => { handleClose(); resetModalSize(); }} sx={{
                background: (theme) => theme.palette.grey[200]
              }}>
                <CloseIcon />
              </Button>
            </Box>
          )}
          {title === 'Presentation - Preview' && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                cursor: 'nw-resize',
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
            </div>
          )}
        </Box>
        <Box sx={{ overflowY: 'auto', maxHeight: '90vh', height: '94%' }}>
          <Box
            sx={{
              // mt: "30px",
              // mb: "20px",
              // overflowY: 'auto',
              height: '98%'
            }}
          >
            {children}
          </Box>
          <Box
            className='f-e-c'
            sx={{
              gap: '20px',
              mt: '5px'
            }}
          >
            {showSaveButton && (
              <>
                <Button
                  variant='contained'
                  sx={(theme) => ({ ...style.cancelBtn(theme) })}
                  disabled= {title === 'My Portal - Upload New Document' ? uploadLoading : false}
                  onClick={handleClose}
                >
                  {yesOrNo ? t('No') : t('Cancel')}
                </Button>
                <Button
                  variant='contained'
                  sx={(theme) => ({ ...style.saveBtn(theme) })}
                  disabled= {title === 'My Portal - Upload New Document' ? uploadLoading : false}
                  onClick={onSave}
                >
                  {yesOrNo ? t('Yes') : t('Save')}
                </Button>{' '}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default BaseModal;
