import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSave: (gender: string) => void;
  value?: string;
}

function AddNewGender({ open, handleClose, handleSave, value = '' }: Props) {
  const [gender, setGender] = useState<string>(value || '');
  const [error, setError] = useState<boolean>(false);

  const validateAndSave = () => {
    if (!gender || gender.length < 1) {
      setError(true);
      return;
    }

    handleSave(gender);
    setGender('');
  };

  useEffect(() => {
    if (value) {
        setGender(value);
    }

    return () => {
        setGender('');
    };
  }, [value]);

  const { t } = useTranslation();

  return (
    <BaseModal
      title='Settings - Gender'
      handleClose={() => {
        setGender('');
        handleClose();
      }}
      onSave={validateAndSave}
      open={open}
    >
    <div style={{marginBottom: '20px'}}>
    <Typography className='SmallBody'>{t('Gender')}</Typography>
      <TextField
        variant='outlined'
        name='firstName'
        placeholder={t('Enter gender').toString()}
        value={gender}
        onChange={(e) => { setGender(e.target.value) }}
        error={error}
        helperText={error ? 'Please enter a valid gender' : ''}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            backgroundColor: 'gray',
            border: "0",
            outline: 0,
            '& fieldset': {
              border: "0",
            },
            '&:hover fieldset': {
              border: "0",
            },
            '&.Mui-focused fieldset': {
              border: "0",
            },
          },
          '& .MuiInputBase-input': {
            padding: '15px', // Adjust padding as needed
            color: 'black', // Optional: Set input text color
              '&::placeholder': {
                color: 'black !important', // Set placeholder color to a much darker color
                opacity: 1, // Ensure the placeholder is fully opaque
              },
          },
        }}
      />
    </div>
    </BaseModal>
  );
}

export default AddNewGender;
