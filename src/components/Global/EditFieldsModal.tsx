import React, { useEffect, useState } from 'react';
import BaseModal from './Modal';
import { Button, Grid, IconButton, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BinIcon from '../Icon/BinIcon';

interface Configuration {
  id: number;
  title: string;
  value: string;
  twoTierNew?: boolean;
}

interface SkillExpertiseState {
  id: number;
  value: string;
}

interface SkillAchievementState {
  id: number;
  title: string;
  value: number;
}

interface onSaveParams {
  updatedFields: Configuration[] | SkillExpertiseState[] | SkillAchievementState[];
  newFields?: Configuration[] | SkillExpertiseState[] | SkillAchievementState[];
  removedFields?: Configuration[] | SkillExpertiseState[] | SkillAchievementState[];
}

interface EditFieldsModalProps {
  fields: Configuration[] | SkillExpertiseState[] | SkillAchievementState[];
  handleClose: () => void;
  open: boolean;
  // eslint-disable-next-line
  onSave: (params: onSaveParams) => void;
  title: string;
  twoTier: boolean;
  addAndDelete: boolean;
  isKeyValue: boolean;
  numberLimit: number;
}

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
}: EditFieldsModalProps) {
  const [values, setValues] = useState<Configuration[] | SkillExpertiseState[] | SkillAchievementState[]>(fields);

  function isConfigurationArray(arr: Configuration[] | SkillExpertiseState[] | SkillAchievementState[]): arr is Configuration[] {
    return arr.length > 0 && 'title' in arr[0] && 'value' in arr[0] && typeof arr[0].value === 'string';
  }

  function isConfigurationType(val: Configuration | SkillExpertiseState | SkillAchievementState): val is Configuration {
    return 'title' in val && 'value' in val && typeof val.value === 'string';
  }

  function isSkillAchievementArray(arr: Configuration[] | SkillExpertiseState[] | SkillAchievementState[]): arr is SkillAchievementState[] {
    return arr.length > 0 && 'title' in arr[0] && 'value' in arr[0] && typeof arr[0].value === 'number';
  }

  function isSkillAchievementType(val: Configuration | SkillExpertiseState | SkillAchievementState): val is SkillAchievementState {
    return 'title' in val && 'value' in val && typeof val.value === 'number';
  }

  function isSkillExpertiseArray(arr: Configuration[] | SkillExpertiseState[] | SkillAchievementState[]): arr is SkillExpertiseState[] {
    return arr.length > 0 && 'value' in arr[0] && !('title' in arr[0]);
  }

  const handleChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    const parsedNewVal = parseInt(newVal, 10);

    if (isSkillAchievementArray(values)) {
      const newValues = values.map((item: SkillAchievementState) => {
        if (item.id === id) {
          return {
            ...item,
            value:
              numberLimit > 0
                ? isNaN(parsedNewVal) ? 0 :
                  parsedNewVal >= numberLimit
                    ? numberLimit
                    : parsedNewVal
                : parsedNewVal,
          };
        }
        return item;
      });
      
      setValues(newValues);
    } else if (isConfigurationArray(values)) {
      const newValues = values.map((item: Configuration) => {
        if (item.id === id) {
          return {
            ...item,
            value: newVal
          };
        }
        return item;
      });
      setValues(newValues);
    } else {
      const newValues = values.map((item: SkillExpertiseState) => {
        if (item.id === id) {
          return {
            ...item,
            value: newVal
          };
        }
        return item;
      });
      setValues(newValues);
    }
  };

  const handleKeyValueChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isConfigurationArray(values)) {
      const newValues = values.map((item: Configuration) => {
        if (item.id === id) {
          return {
            ...item,
            title: event.target.value,
          };
        }
        return item;
      });
      setValues(newValues);
    }
  };

  useEffect(() => {
    setValues(fields);
  }, [fields]);

  const handleAddField = () => {
    if (isConfigurationArray(values)) {
      const newField = {
        id: Math.random(),
        value: '',
        title: '',
        twoTierNew: true,
      };
      setValues([...values, newField]);
    }
  };

  const handleDeleteField = (id: number) => () => {
    if (isConfigurationArray(values)) {
      const newValues = values.filter((item: Configuration) => item.id !== id);

      setValues(newValues);
    }
  };

  const handleSave = () => {
    if (isConfigurationArray(values) && isConfigurationArray(fields)) {
      onSave({
        updatedFields: values.filter((item: Configuration) => {
          const field = fields.find((field: Configuration) => field.id === item.id);
          return field && field.value !== item.value;
        }),
        newFields: values.filter((item: Configuration) => {
          const field = fields.find((field: Configuration) => field.id === item.id);
          return !field;
        }),
        removedFields: fields.filter((item: Configuration) => {
          const field = values.find((field: Configuration) => field.id === item.id);
          return !field;
        }),
      });
    } else if (isSkillAchievementArray(values) && isSkillAchievementArray(fields)) {
      onSave({
        updatedFields: values.filter((item: SkillAchievementState) => {
          const field = fields.find((field: SkillAchievementState) => field.id === item.id);
          return field && field.value !== item.value;
        }),
      });
    } else if (isSkillExpertiseArray(values) && isSkillExpertiseArray(fields)) {
      onSave({
        updatedFields: values.filter((item: SkillExpertiseState) => {
          const field = fields.find((field: SkillExpertiseState) => field.id === item.id);
          return field && field.value !== item.value;
        }),
      });
    }

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
        {values.map((field: Configuration | SkillExpertiseState | SkillAchievementState, i: number) => {
          if (isConfigurationType(field)) {
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
          } else {
            return (
              <Grid item xs={12} key={i}>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'
                  gap={2}
                >
                  <TextField
                    size='small'
                    variant='standard'
                    fullWidth
                    value={field.value}
                    hiddenLabel={!twoTier}
                    onChange={handleChange(field.id)}
                    label={twoTier && isSkillAchievementType(field) ? t(field.title) : ''}
                    sx={{
                      pb: '10px',
                    }}
                  />
                </Stack>
              </Grid>
            );
          }
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
