import React from 'react';
import BaseModal from './Modal';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DeleteModal({ open, onConfirm, onCancel, title, message }: any) {
  const { t } = useTranslation();
  return (
    <BaseModal
      open={open}
      handleClose={onCancel}
      title={title}
      yesOrNo={true}
      onSave={onConfirm}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography textAlign={'center'} fontSize={18} fontWeight={500}
            className='SmallBody'
            sx={{
              // display: 'flex',
              marginBottom: '20px',
            }}
          >
            {t(message || 'Do you want to delete the selected item ?')}
          </Typography>
        </Grid>
      </Grid>
    </BaseModal>
  );
}

export default DeleteModal;
