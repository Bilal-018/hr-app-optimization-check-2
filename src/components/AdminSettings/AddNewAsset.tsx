import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

interface AssetInfo {
  assetConfigurationId: number;
  equipment: string;
  brand: string;
  model: string;
  registration: string | null;
  expiryDate: string;
  isActive?: boolean;
}

interface AddNewAssetProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line
  handleSave: (assetInfo: AssetInfo) => void;
  asset?: AssetInfo;
}

const initialState = {
  assetConfigurationId: 0,
  equipment: '',
  brand: '',
  model: '',
  registration: '',
  expiryDate: '',
};

const validate = (values: AssetInfo) => {
  let errors = {
    equipment: false,
    brand: false,
    model: false,
    registration: false,
    expiryDate: false,
  };
  if (!values.equipment || values.equipment.trim() === '') {
    errors.equipment = true;
  }
  if (!values.brand || values.brand.trim() === '') {
    errors.brand = true;
  }

  if (!values.model || values.model.trim() === '') {
    errors.model = true;
  }
  if (!values.registration || values.registration.trim() === '') {
    errors.registration = true;
  }
  if (!values.expiryDate || values.expiryDate === '') {
    errors.expiryDate = true;
  }
  return errors;
};

const AddNewAsset: React.FC<AddNewAssetProps> = ({
  open,
  handleClose,
  handleSave,
  asset,
}) => {

  const [assetInfo, setAssetInfo] = useState<AssetInfo>(initialState);
  const [errors, setErrors] = useState<Record<string, boolean>>({
    equipment: false,
    brand: false,
    model: false,
    registration: false,
    expiryDate: false,
  });

  useEffect(() => {
    if (asset) {
      setAssetInfo(asset as AssetInfo);
    }
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: string; value: string | number };
    setAssetInfo((pre: AssetInfo) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return { ...pre, [name]: value };
      } else {
        console.error('Invalid value type for %s:', name, value);
        return pre;
      }
    });
  };

  const onSave = () => {
    const errors = validate(assetInfo);
    if (Object.values(errors).some((item: boolean) => item)) {
      setErrors(errors);
      return;
    }

    setErrors({
      equipment: false,
      brand: false,
      model: false,
      registration: false,
      expiryDate: false,
    });

    setAssetInfo(initialState);

    handleSave(assetInfo as AssetInfo);
  };

  const { t, i18n } = useTranslation();

  return (
    <BaseModal
      title='Add new asset'
      handleClose={handleClose as () => void}
      onSave={onSave}
      open={open as boolean}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Equipment')}</Typography>

          <TextField
            variant='outlined'
            name='equipment'
            placeholder={t('Enter Equipment name').toString()}
            onChange={handleChange}
            value={assetInfo.equipment}
            error={errors.equipment}
            helperText={errors.equipment && t('Equipment is required')}
          />
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Brand')}</Typography>
          <TextField
            variant='outlined'
            name='brand'
            placeholder={t('Enter Brand').toString()}
            onChange={handleChange}
            value={assetInfo.brand}
            error={errors.brand}
            helperText={errors.brand && t('Brand is required')}
          />
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Model')}</Typography>
          <TextField
            variant='outlined'
            name='model'
            placeholder={t('Enter Model').toString()}
            onChange={handleChange}
            value={assetInfo.model}
            error={errors.model}
            helperText={errors.model && t('Model is required')}
          />
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Registration')}</Typography>
          <TextField
            variant='outlined'
            name='registration'
            placeholder={t('Enter registration or serial number').toString()}
            onChange={handleChange}
            value={assetInfo.registration}
            error={errors.registration}
            helperText={errors.registration && t('Registration is required')}
          />
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Expiry Date')}</Typography>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <DatePicker
              name='expiryDate'
              defaultValue={assetInfo.expiryDate}
              value={dayjs(assetInfo.expiryDate) as Dayjs}
              format='DD/MM/YYYY'
              onChange={(newValue: any) => {
                if (newValue instanceof Date) {
                  setAssetInfo((pre: AssetInfo) => ({
                    ...pre,
                    expiryDate: newValue.toString(),
                  }));
                }
              }}
            // onError={errors.expiryDate}
            // helperText={`${errors.expiryDate && t('ExpiryDate is required')}`}
            />
          </LocalizationProvider>
        </Grid>{' '}
        {/*<Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Switch />
            <Typography variant="extraSmallBody">Active</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="SmallBody">Comments</Typography>
          <TextField
            variant="outlined"
            name="firstName"
            placeholder="Enter notes here"
            multiline
            rows={4}
          />
        </Grid>*/}
      </Grid>
    </BaseModal>
  );
};

export default AddNewAsset;
