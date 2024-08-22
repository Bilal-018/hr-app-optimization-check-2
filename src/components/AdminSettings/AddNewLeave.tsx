import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { errorHelperText } from '../../utils/validation';
import { useTranslation } from 'react-i18next';
import jwtInterceoptor, { jwtLeave } from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import { AxiosError, AxiosResponse } from 'axios';

interface LeaveTypeState {
  leaveType: string;
  daysEntitled: number;
  genderRestriction: string;
  leaveCategoryId: number | null;
  contractTypeId: number[];
  genderRestrictionId: number[],
}

const initialState: LeaveTypeState = {
  leaveType: '',
  daysEntitled: 0,
  genderRestriction: '',
  leaveCategoryId: null,
  contractTypeId: [],
  genderRestrictionId: [],
};

interface ValidationErrors {
  leaveType: boolean;
  daysEntitled: boolean;
  genderRestriction: boolean;
  leaveCategory: boolean;
}

const validate = (values: LeaveTypeState) => {
  let errors: ValidationErrors = {
    leaveType: false,
    daysEntitled: false,
    genderRestriction: false,
    leaveCategory: false,
  };
  if (!values.leaveType || values.leaveType.trim() === '') {
    errors.leaveType = true;
  }
  if (!values.daysEntitled || values.daysEntitled === 0) {
    errors.daysEntitled = true;
  }
  if (!values.genderRestriction || values.genderRestriction.trim() === '') {
    errors.genderRestriction = true;
  }
  if (values.leaveCategoryId === null) {
    errors.leaveCategory = true;
  }
  return errors;
};

interface AddNewLeaveProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line
  handleSave: (leaveInfo: LeaveTypeState) => void;
  leave: LeaveTypeState | undefined;
  loading: boolean;
}

interface Gender {
  genderId: number;
  gender: string;
}

interface Category {
  leaveCategoryId: number;
  leaveCategory: string;
  description: string;
}

interface ContractType {
  id: number,
  contractType: string
}

interface ContractTypeData {
  contractTypeId: number,
  contractType: string
}

const textFieldStyles = {
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
}

const AddNewLeave = ({ open, handleClose, handleSave, leave, loading }: AddNewLeaveProps) => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [leaveCategory, setLeaveCategory] = useState<Category[]>([]);
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [secondBoxItems, setSecondBoxItems] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [leaveInfo, setLeaveInfo] = useState<LeaveTypeState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({
    leaveType: false,
    daysEntitled: false,
    genderRestriction: false,
    leaveCategory: false,
  });

  useEffect(() => {
    if (leave !== undefined) {
      setLeaveInfo(leave);
      setSecondBoxItems(leave.contractTypeId);
    } else {
      setLeaveInfo(initialState);
    }
  }, [leave]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (typeof value === 'string') {
      if (((name === 'daysEntitled' && value.trim() !== '') || name === 'leaveCategoryId')) {
        const numericValue = parseInt(value, 10);
        setLeaveInfo((pre: LeaveTypeState) => ({ ...pre, [name]: numericValue }));
      } else {
        setLeaveInfo((pre: LeaveTypeState) => ({ ...pre, [name]: value }));
      }
    }
  };

  const onSave = () => {
    const errors: ValidationErrors = validate(leaveInfo);
    if (Object.values(errors).some((item: boolean) => item)) {
      setErrors(errors);
      return;
    }

    setErrors({
      leaveType: false,
      daysEntitled: false,
      genderRestriction: false,
      leaveCategory: false,
    });

    handleSave(leaveInfo);
    setLeaveInfo(initialState);
    setSelectedItems([]);
    setSecondBoxItems([]);
  };

  interface Snackbar {
    // eslint-disable-next-line
    showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
  }

  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const { t } = useTranslation();

  const getGender = () => {
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/GenderMaster/GetAllGenderMasters')
      .then((res: AxiosResponse<Gender[]>) => {
        setGenders(res.data);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  };

  const getLeaveCategory = () => {

    jwtLeave
      .get('api/LeaveConfiguration/GetLeaveCategories')
      .then((res: AxiosResponse<Category[]>) => {
        setLeaveCategory(res.data);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  };

  const getContractTypeData = () => {
    jwtInterceoptor
      .get('api/ContractTypeMasters/GetAllContractType')
      .then((res: AxiosResponse<ContractTypeData[]>) => {
        setContracts(
          res.data.map((contract: ContractTypeData) => ({
            id: contract.contractTypeId,
            contractType: contract.contractType,
          }))
        );
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const handleNavigation = (type: string) => {
    switch (type) {
      case '>>':
        setSelectedItems(contracts.map(contract => contract.id));
        setAllSelected(!allSelected);
        break;
      case '>':
        setSecondBoxItems([...secondBoxItems, ...selectedItems.filter((item: number) => !secondBoxItems.includes(item))]);
        setSelectedItems(selectedItems.filter((item: number) => secondBoxItems.includes(item)));
        break;
      case '<':
        setSecondBoxItems(secondBoxItems.filter((item: number) => !selectedItems.includes(item)));
        setSelectedItems(selectedItems.filter((item: number) => !secondBoxItems.includes(item)));
        break;
      case '<<':
        setSelectedItems([]);
        setSecondBoxItems([]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getGender();
    getLeaveCategory();
    getContractTypeData();
  }, [])

  useEffect(() => {
    setSecondBoxItems([...secondBoxItems, ...selectedItems.filter((item: number) => !secondBoxItems.includes(item))]);
    setSelectedItems([]);
  }, [allSelected])

  useEffect(() => {
    setLeaveInfo({ ...leaveInfo, contractTypeId: secondBoxItems })
  }, [secondBoxItems])

  return (
    <BaseModal
      title={leave !== undefined ? 'Admin - Update leave' : 'Admin - New leave'}
      handleClose={() => { handleClose(); setLeaveInfo(initialState); setErrors({ leaveType: false, daysEntitled: false, genderRestriction: false, leaveCategory: false }); setSelectedItems([]); setSecondBoxItems([]); }}
      onSave={onSave}
      open={open}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5.75}>
            <Typography className='SmallBody'>{t('Leave')}</Typography>
            <TextField
              variant='outlined'
              name='leaveType'
              placeholder={t('Annual leave').toString()}
              onChange={handleChange}
              value={leaveInfo.leaveType}
              error={errors.leaveType}
              helperText={errors.leaveType && t('Leave type is required')}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={5.75}>
            <Typography className='SmallBody'>{t('Days entitled')}</Typography>
            <TextField
              variant='outlined'
              name='daysEntitled'
              placeholder={t('Enter days entitled').toString()}
              onChange={handleChange}
              value={leaveInfo.daysEntitled}
              error={errors.daysEntitled}
              helperText={errors.daysEntitled && t('Days entitled is required and should be greater than 0')}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              {t('Contract restriction')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: { sm: 'normal', xs: 'center' }, gap: '16px', mt: '16px', flexDirection: { sm: 'row', xs: 'column' } }}>
              <Box sx={{ boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)', width: { sm: 216, xs: '100%' } }}>
                <FormGroup>
                  {contracts.filter((contract: ContractType) => !secondBoxItems.includes(contract.id)).map((contract: ContractType) => (
                    <ListItem
                      key={contract.id}
                      sx={{
                        px: '16px',
                        py: 0,
                        my: '2px',
                        backgroundColor: selectedItems.includes(contract.id) ? 'primary.main' : 'transparent',
                        color: selectedItems.includes(contract.id) ? 'white' : '',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                      onClick={() => {
                        if (selectedItems.includes(contract.id)) {
                          setSelectedItems(selectedItems.filter((item: number) => item !== contract.id));
                        } else {
                          setSelectedItems([...selectedItems, contract.id]);
                        }
                      }}
                    >
                      <ListItemText primary={contract.contractType} />
                    </ListItem>
                  ))}
                </FormGroup>
              </Box>
              <Box my='auto'>
                <Box sx={{ display: 'flex', gap: '8px', flexDirection: { sm: 'column', xs: 'row' } }}>
                  <Button variant='outlined' color='primary' size='small' onClick={() => { handleNavigation('>>') }} disabled={secondBoxItems.length === contracts.length}>
                    <Typography fontSize={12}>{`>>`}</Typography>
                  </Button>
                  <Button variant='outlined' color='primary' size='small' onClick={() => { handleNavigation('>') }} disabled={secondBoxItems.length === contracts.length || !selectedItems.length || selectedItems.every((item: number) => secondBoxItems.includes(item))}>
                    <Typography fontSize={12}>{`>`}</Typography>
                  </Button>
                  <Button variant='outlined' color='primary' size='small' onClick={() => { handleNavigation('<') }} disabled={!secondBoxItems.length || !selectedItems.length || selectedItems.every((item: number) => !secondBoxItems.includes(item))}>
                    <Typography fontSize={12}>{`<`}</Typography>
                  </Button>
                  <Button variant='outlined' color='primary' size='small' onClick={() => { handleNavigation('<<') }} disabled={!secondBoxItems.length}>
                    <Typography fontSize={12}>{`<<`}</Typography>
                  </Button>
                </Box>
              </Box>
              <Box sx={{ boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)', width: { sm: 216, xs: '100%' } }}>
                <FormGroup>
                  {secondBoxItems.map((contractTypeId: number) => (
                    <ListItem
                      key={contractTypeId}
                      sx={{
                        px: '16px',
                        py: 0,
                        my: '2px',
                        backgroundColor: selectedItems.includes(contractTypeId) ? 'primary.main' : 'transparent',
                        color: selectedItems.includes(contractTypeId) ? 'white' : '',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                      onClick={() => {
                        if (selectedItems.includes(contractTypeId)) {
                          setSelectedItems(selectedItems.filter((item: number) => item !== contractTypeId));
                        } else {
                          setSelectedItems([...selectedItems, contractTypeId]);
                        }
                      }}
                    >
                      <ListItemText primary={contracts.find((contract: ContractType) => contract.id === contractTypeId)?.contractType} />
                    </ListItem>
                  ))}
                </FormGroup>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5.75}>
            <Typography className='SmallBody'>
              {t('Leave category')}
            </Typography>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              name='leaveCategoryId'
              onChange={handleChange}
              value={leaveInfo.leaveCategoryId}
              row
            >
              {leaveCategory.map((cat: Category) => (
                <Tooltip title={t(cat.description)} placement="bottom-start" arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#18A0FB',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: 14,
                        maxWidth: 'none',
                        '& .MuiTooltip-arrow': {
                          color: '#18A0FB',
                        },
                      },
                    },
                  }}>
                  <FormControlLabel
                    key={cat.leaveCategoryId}
                    value={cat.leaveCategoryId}
                    control={<Radio />}
                    label={cat.leaveCategory}
                  />
                </Tooltip>
              ))}
            </RadioGroup>
            <Typography color={'error'} fontSize={12}>
              {errors.leaveCategory &&
                errorHelperText(t('Leave Category is required'))}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5.75}>
            <Typography className='SmallBody'>
              {t('Gender restriction')}
            </Typography>
            <FormGroup
              row
            >
              {genders.map((gender: Gender) => (
                <FormControlLabel
                  key={gender.genderId}
                  control={<Checkbox
                    checked={leaveInfo.genderRestrictionId.includes(gender.genderId)}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newGenderRestrictionId = [...leaveInfo.genderRestrictionId];
                      const newGenderRestriction = leaveInfo.genderRestriction ? leaveInfo.genderRestriction.split(', ') : [];

                      if (checked) {
                        newGenderRestrictionId.push(gender.genderId);
                        newGenderRestriction.push(gender.gender);
                      } else {
                        const index = newGenderRestrictionId.indexOf(gender.genderId);
                        if (index !== -1) {
                          newGenderRestrictionId.splice(index, 1);
                          newGenderRestriction.splice(index, 1);
                        }
                      }

                      setLeaveInfo({
                        ...leaveInfo,
                        genderRestrictionId: newGenderRestrictionId,
                        genderRestriction: newGenderRestriction.join(', '),
                      });
                    }}
                    value={gender.genderId}
                  />}
                  label={t(gender.gender)}
                />
              ))}
            </FormGroup>
            <Typography color={'error'} fontSize={12}>
              {errors.genderRestriction &&
                errorHelperText(t('Gender restriction is required'))}
            </Typography>
          </Grid>
        </Grid>
      )}
    </BaseModal>
  );
};

export default AddNewLeave;
