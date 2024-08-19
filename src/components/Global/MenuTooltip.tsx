import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';

function MenuTooltip({
  menu,
  children,
  inTooltip,
  isMobile,
  open,
  handleOpenTooltip,
  handleCloseTooltip,
}: any) {
  const { t } = useTranslation();

  if (!inTooltip || !menu) {
    return children;
  }

  const mobileProps = isMobile
    ? {
        PopperProps: {
          disablePortal: true,
        },
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true,
        open: open,
        onClose: () => {
          console.log('close');
          handleCloseTooltip();
        },
      }
    : {};

  return (
    <Tooltip
      title={menu ? menu : t('No menu available')}
      placement='right'
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            borderRadius: '10px',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)',
            backgroundColor: 'white',
            color: 'black',
          },
        },
        arrow: {
          sx: {
            color: 'white',
          },
        },
      }}
      {...mobileProps}
    >
      {React.cloneElement(children, {
        onClick: () => (isMobile ? handleOpenTooltip() : {}),
      })}
    </Tooltip>
  );
}

export default MenuTooltip;
