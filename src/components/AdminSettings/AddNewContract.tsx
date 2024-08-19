import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSave: (contractName: string) => void;
  value?: string;
}

function AddNewContract({ open, handleClose, handleSave, value = '' }: Props) {
  const [contractName, setContractName] = useState<string>(value || '');
  const [error, setError] = useState<boolean>(false);

  const validateAndSave = () => {
    if (!contractName || contractName.length < 1) {
      setError(true);
      return;
    }

    handleSave(contractName);
    setContractName('');
  };

  useEffect(() => {
    if (value) {
      setContractName(value);
    }

    return () => {
      setContractName('');
    };
  }, [value]);

  const { t } = useTranslation();

  return (
    <BaseModal
      title='Settings - Contract '
      handleClose={() => {
        setContractName('');
        handleClose();
      }}
      onSave={validateAndSave}
      open={open}
    >
    <div style={{marginBottom: '20px'}}>
    <Typography className='SmallBody'>{t('Contract')}</Typography>
      <TextField
        variant='outlined'
        name='firstName'
        placeholder={t('Enter contract type').toString()}
        value={contractName}
        onChange={(e) => { setContractName(e.target.value) }}
        error={error}
        helperText={error ? 'Please enter a valid contract type' : ''}
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

export default AddNewContract;
