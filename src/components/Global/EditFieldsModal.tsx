import React, { useEffect, useState } from 'react';
import BaseModal from './Modal';
import { Button, Grid, IconButton, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BinIcon from '../Icon/BinIcon';

function EditFieldsModal({
  fields,
  handleClose,
  open,
  onSave,
  title,
  twoTier,
  addAndDelete,
  isKeyValue = false,
  numberLimit = 0,
}: any) {
  const [values, setValues] = useState<any>(fields);

  const handleChange = (id: any) => (event: any) => {
    const newVal = event.target.value;
    const newValues = values.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          value:
            numberLimit > 0
              ? newVal >= numberLimit
                ? numberLimit
                : newVal
              : newVal,
        };
      }
      return item;
    });
    setValues(newValues);
  };

  const handleKeyValueChange = (id: any) => (event: any) => {
    const newValues = values.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          title: event.target.value,
        };
      }
      return item;
    });
    setValues(newValues);
  };

  useEffect(() => {
    setValues(fields);
  }, [fields]);

  const handleAddField = () => {
    const newField = {
      id: Math.random(),
      value: '',
      title: '',
      twoTierNew: true,
    };
    setValues([...values, newField]);
  };

  const handleDeleteField = (id: any) => () => {
    const newValues = values.filter((item: any) => item.id !== id);

    setValues(newValues);
  };

  const handleSave = () => {
    onSave({
      updatedFields: values.filter((item: any) => {
        const field = fields.find((field: any) => field.id === item.id);
        return field && field.value !== item.value;
      }),
      newFields: values.filter((item: any) => {
        const field = fields.find((field: any) => field.id === item.id);
        return !field;
      }),
      removedFields: fields.filter((item: any) => {
        const field = values.find((field: any) => field.id === item.id);
        return !field;
      }),
    });

    handleClose();
  };

  const { t } = useTranslation();

  return (
    <BaseModal
      open={open}
      handleClose={handleClose}
      onSave={handleSave}
      title={title}
    >
      <Grid container spacing={2}>
        {values.map((field: any, i: any) => {
          return (
            <Grid item xs={12} key={i}>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                gap={2}
              >
                {isKeyValue && field.twoTierNew ? (
                  <>
                    <TextField
                      size='small'
                      variant='standard'
                      fullWidth
                      value={field.title}
                      onChange={handleKeyValueChange(field.id)}
                      label={t('Key')}
                      sx={{
                        pb: '10px',
                      }}
                    />
                    <TextField
                      size='small'
                      variant='standard'
                      fullWidth
                      value={field.value}
                      label={t('Value')}
                      onChange={handleChange(field.id)}
                      sx={{
                        pb: '10px',
                      }}
                    />
                  </>
                ) : (
                  <TextField
                    size='small'
                    variant='standard'
                    fullWidth
                    value={field.value}
                    hiddenLabel={!twoTier}
                    onChange={handleChange(field.id)}
                    label={twoTier ? t(field.title) : ''}
                    sx={{
                      pb: '10px',
                    }}
                  />
                )}
                {addAndDelete && (
                  <IconButton onClick={handleDeleteField(field.id)}>
                    <BinIcon />
                  </IconButton>
                )}
              </Stack>
            </Grid>
          );
        })}
        {addAndDelete && (
          <Grid item xs={12}>
            <Button
              variant='outlined'
              color='primary'
              fullWidth
              onClick={handleAddField}
            >
              {t('Add Field')}
            </Button>
          </Grid>
        )}
      </Grid>
    </BaseModal>
  );
}

export default EditFieldsModal;
