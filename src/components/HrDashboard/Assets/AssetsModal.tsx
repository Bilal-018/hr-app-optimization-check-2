import React, { useState, useEffect } from 'react';
import BaseModal from '../../Global/Modal';
import { Grid, TextField, Typography, Switch, Stack } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const ActiveSwitch = styled(Switch)(({ }) => ({
  width: 44,
  height: 24,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 24,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(12px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor: '#B3B3BF',
    boxSizing: 'border-box',
  },
}));

// interface RowData {
//   equipment: string;
//   brand: string;
//   model: string;
//   registrationNumber: string;
//   status: JSX.Element;
//   comments: string;
// }

// const headCells = [
//   {
//     id: 'equipment',
//     label: 'Equipment',
//   },
//   // Add other headCells definitions
// ];

// const states = [
//   {
//     label: 'Granted',
//     color: 'success',
//   },
//   // Add other states definitions
// ];

// const rows: RowData[] = [
//   // Your rows data
// ];

interface AssetsModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  onSave: (data: any) => void;
  data: any; // You should define the actual type of data
  setData: React.Dispatch<any>; // You should define the actual type of setData
}

const AssetsModal: React.FC<AssetsModalProps> = ({
  open,
  handleClose,
  title,
  onSave,
  data,
}) => {
  const [active, setActive] = useState(false);
  title = `Hr Manager - ${data?.assetConfigurationId ? 'Update asset' : title}`;

  useEffect(() => {
    if (data) {
      setActive(data.isActive === true);
    }
  }, [data]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActive(event.target.checked);
  };

  const { t } = useTranslation();

  return (
    <BaseModal
      open={open}
      handleClose={handleClose}
      title={title}
      onSave={onSave}
    >
      <Grid container spacing={3} mt={0}>
        <Grid item xs={12} sm={6}>
          <Typography fontSize={14} fontWeight={500} >{t('Equipment')}</Typography>
          <TextField
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                border: 0,
                borderRadius: '10px'
              },
              borderRadius: '10px'
            }}
            variant='outlined'
            name='equipment'
            placeholder={t('Enter equipment name').toString()}
            value={data?.equipment}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography fontSize={14} fontWeight={500} >{t('Brand')}</Typography>
          <TextField
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                border: 0,
                borderRadius: '10px'
              },
              borderRadius: '10px'
            }}
            variant='outlined'
            name='brand'
            placeholder={t('Enter brand').toString()}
            value={data?.brand}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography fontSize={14} fontWeight={500} >{t('Model')}</Typography>
          <TextField
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                border: 0,
                borderRadius: '10px'
              },
              borderRadius: '10px'
            }}
            variant='outlined'
            name='model'
            placeholder={t('Enter model').toString()}
            value={data?.model}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography fontSize={14} fontWeight={500} >{t('Registeration')}</Typography>
          <TextField
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                border: 0,
                borderRadius: '10px'
              },
              borderRadius: '10px'
            }}
            variant='outlined'
            name='registeration'
            placeholder={t('Enter registeration or serial number').toString()}
            value={data?.registration}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            justifyContent='flex-start'
          >
            <ActiveSwitch
              checked={active}
              inputProps={{ 'aria-label': 'ant design' }}
              onClick={() => {
                setActive(!active)
              }}
              onChange={handleSwitchChange}
            />
            <Typography color='primary'>{t('Active')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} mb='12px'>
          <Typography fontSize={14} fontWeight={500}>{t('Comments')}</Typography>
          <TextField
            variant='outlined'
            placeholder={t('Enter comments').toString()}
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: 'gray',
                border: '0',
                outline: 0,
                '& fieldset': {
                  border: '0',
                },
                '&:hover fieldset': {
                  border: '0',
                },
                '&.Mui-focused fieldset': {
                  border: '0',
                },
                typography: 'body2',
              },
            }}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
};

export default AssetsModal;
