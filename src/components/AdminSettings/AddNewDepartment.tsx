import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSave: (department: DepartmentState) => void;
  department: DepartmentState;
  title: string;
}

interface DepartmentState {
  department: string;
  costCenter: string;
  id: number | null;
}

const initialState: DepartmentState = {
  department: '',
  costCenter: '',
  id: null,
};

function AddNewDepartment({
  open,
  handleClose,
  handleSave,
  department,
  title,
}: Props) {
  const [newDepartment, setNewDepartment] = useState<DepartmentState>(
    department.department ? department : initialState
  );
  const [error, setError] = useState<{
    department: boolean;
    costCenter: boolean;
  }>({
    department: false,
    costCenter: false,
  });

  useEffect(() => {
    if (!department.department) return;
    setNewDepartment(department);
  }, [department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value as string });
  };

  const onSave = () => {
    const errorCol = {
      department:
        !newDepartment.department || newDepartment.department.trim() === '',
      costCenter:
        !newDepartment.costCenter || newDepartment.costCenter.trim() === '',
    };

    setError(errorCol);

    if (!errorCol.costCenter && !errorCol.department) {
      handleSave(newDepartment);
      handleClose();
    }

    setNewDepartment(initialState);
  };

  const onCancel = () => {
    setNewDepartment(initialState);
    handleClose();
  };

  const { t } = useTranslation();

  return (
    <BaseModal title={title} handleClose={onCancel} onSave={onSave} open={open}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          margin: '10px 0',
          marginBottom: '30px',
        }}
      >
        <div style={{ flex: 1 }}>
          <Typography variant='body2' sx={{ fontWeight: '500' }}>
            {t('Department')}
          </Typography>
          <TextField
            variant='outlined'
            name='department'
            placeholder={t('Enter Department').toString()}
            error={error.department}
            helperText={error.department && t('Please enter valid department')}
            onChange={handleChange}
            value={newDepartment.department}
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
        <div style={{ flex: 1 }}>
          <Typography variant='body2' sx={{ fontWeight: '500' }}>
            {t('Cost centre')}
          </Typography>
          <TextField
            variant='outlined'
            name='costCenter'
            placeholder={t('Enter Cost centre').toString()}
            error={error.costCenter}
            helperText={error.costCenter && t('Please enter valid cost centre')}
            onChange={handleChange}
            value={newDepartment.costCenter}
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
      </Box>
    </BaseModal>
  );
}

export default AddNewDepartment;
