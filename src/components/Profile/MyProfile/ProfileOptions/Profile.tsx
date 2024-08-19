import {
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useContext,
} from 'react';
import CountrySelect from '../../../Global/CountryDropdown';
import { Email } from '@mui/icons-material';
import EditAndSave from '../../../Global/EditAndSave';
import PhoneInput from 'react-phone-input-2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  errorHelperText,
  validateProfileData,
} from '../../../../utils/validation';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../../../../services/interceptors';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../../Global/WithSnackbar';
import { themeContext } from '../../../../theme';
import Select from '../../../Global/Select';
import CalendarIcon from '../../../Icon/CalenderIcon';
import {
  isValidPhoneNumber
} from "libphonenumber-js";
import parseMax from 'libphonenumber-js/max'

const isValidInternationalPhoneNumber = (number: any, country: any) => {
  return isValidPhoneNumber(number, country);
};

const PrivateInformation = ({ state, dispatch, disable, lg, xl, setValidPhone }: any) => {
  const hasError = (field: any) => {
    return state.error.includes(field);
  };

  const { myTheme }: any = useContext(themeContext);
  const { t, i18n }: any = useTranslation();

  console.log('TEST state', state);

  return (
    <Grid
      item
      className='section-border'
      // sm={12}
      // md={12}
      lg={lg}
      xl={xl}
      sx={() => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        {t('Private information')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Grid container mt='21px' rowGap='20px' columnGap={3}>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Address')}</Typography>
            <TextField
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
              }}
              disabled={disable}
              value={state.employeeAddressDto.address}
              variant='outlined'
              placeholder={t('Enter address')}
              onChange={(e) =>
                dispatch({
                  type: 'sharedInformation',
                  field: 'address',
                  value: e.target.value,
                })
              }
              helperText={hasError('address') && t('Address is required')}
              error={hasError('address')}

            />
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('City')}</Typography>
            <TextField
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
              }}
              className='outlined'
              name='city'
              disabled={disable}
              placeholder={t('Enter City')}
              value={state.employeeAddressDto.city}
              onChange={(e) =>
                dispatch({
                  type: 'sharedInformation',
                  field: 'city',
                  value: e.target.value,
                })
              }
              helperText={hasError('city') && t('City is required')}
              error={hasError('city')}
            />
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Postal Code')}</Typography>
            <TextField
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
              }}
              className='outlined'
              name='postCode'
              placeholder={t('Enter Postal Code')}
              disabled={disable}
              value={state.employeeAddressDto.postCode}
              onChange={(e) =>
                dispatch({
                  type: 'sharedInformation',
                  field: 'postCode',
                  value: e.target.value,
                })
              }
              helperText={hasError('postCode') && t('Postal Code is required')}
              error={hasError('postCode')}
            />
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Country')}</Typography>
            <CountrySelect
              dispatch={dispatch}
              value={state.employeeAddressDto.country}
              disabled={disable}
              helperText={hasError('country') && t('Country is required')}
              error={hasError('country')}
            />
          </Grid>
          {/* </Grid> */}

          {/* <Grid container mt='21px' gap='20px'> */}
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>
              {t('Social security number')}
            </Typography>
            <TextField
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
              }}
              disabled={disable}
              variant='outlined'
              name='socialSecurityNumber'
              placeholder={t('Enter social security number')}
              value={state.socialSecurityNumber}
              onChange={(e) =>
                dispatch({
                  type: 'privateInformation',
                  field: 'socialSecurityNumber',
                  value: e.target.value,
                })
              }
              helperText={
                hasError('socialSecurityNumber') &&
                t('Social security number is required')
              }
              error={hasError('socialSecurityNumber')}
            />
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>
              {t('Personal email address')}
            </Typography>
            <TextField
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
              }}
              disabled={disable}
              variant='outlined'
              name='personalEmailId'
              placeholder={t('Enter email address')}
              type='email'
              value={state.personalEmailId}
              onChange={(e) =>
                dispatch({
                  type: 'privateInformation',
                  field: 'personalEmailId',
                  value: e.target.value,
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email color='error' className='10px' />
                  </InputAdornment>
                ),
              }}
              helperText={
                hasError('personalEmailId') && t('Email address is required')
              }
              error={hasError('personalEmailId')}
            />
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Phone Number')}</Typography>
            <PhoneInput
              inputStyle={{ border: 'none', background: 'transparent' }}
              buttonStyle={{ border: 'none', borderRight: '1px solid rgba(9, 44, 76, 0.1)' }}
              containerStyle={{ backgroundColor: '#F7F8FB', borderRadius: '10px' }}
              disabled={disable}
              placeholder={t('Enter phone number')}
              value={state.personalMobileNumber}
              onChange={(phone) =>
                dispatch({
                  type: 'privateInformation',
                  field: 'personalMobileNumber',
                  value: phone,
                })
              }
              country={'ca'}
              containerClass={
                myTheme.name + (hasError('phoneNumber') ? 'error' : '')
              }
              isValid={(value, country: any) => {
                let isValid = true;
                if (!disable && value && value.length > country.countryCode.length) {
                  isValid = false;
                  if (!isValidInternationalPhoneNumber(value, country.iso2.toUpperCase())) {
                    setValidPhone(isValid);
                    return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                  } else {
                    let val = "+" + value;
                    const parsedValue = parseMax(val);
                    if (parsedValue !== undefined && parsedValue.getType() !== undefined) {
                      isValid = true;
                      setValidPhone(isValid);
                      return isValid;
                    } else {
                      setValidPhone(isValid);
                      return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                    }
                  }
                } else {
                  setValidPhone(isValid);
                  return isValid;
                }
              }}
            />
            <Typography color={'error'} fontSize={12}>
              {errorHelperText(
                hasError('personalMobileNumber') && t('Phone number is required')
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Date of birth')}</Typography>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <DatePicker
                slots={{
                  openPickerIcon: CalendarIcon
                }}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 0,
                  },
                  borderRadius: '10px'
                }}
                disabled={disable}
                disableOpenPicker={disable}
                name='dateOfBirth'
                value={dayjs(state.dateOfBirth)}
                format='DD/MM/YYYY'
                maxDate={dayjs()}
                onChange={(e) =>
                  dispatch({
                    type: 'privateInformation',
                    field: 'dateOfBirth',
                    // value: e && e.$d.toISOString(),
                    value: e && e.toISOString(),
                  })
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} xl={5.75}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Language')}</Typography>
            <Select
              sx={{
                borderRadius: '10px',
                '& fieldset': {
                  border: '0',
                },
                '&.Mui-disabled fieldset': {
                  border: 'none',
                },
              }}
              variant='outlined'
              placeholder={t('Select Language')}
              name={t('preferred Language')}
              value={state.preferedLanguage}
              onChange={(e: any) =>
                dispatch({
                  type: 'privateInformation',
                  field: 'preferedLanguage',
                  value: e.target.value,
                })
              }
              disabled={disable}
              error={hasError(state.preferedLanguage)}
              className='error'
            >
              <MenuItem value='English'>English</MenuItem>
              <MenuItem value='French'>French</MenuItem>
              <MenuItem value='Spanish'>Spanish</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const SharedInformation = ({ gap, state, dispatch, disable, lg, xl, setValidPhone }: any) => {
  const hasError = (field = '') => {
    return state.error.includes(field);
  };

  const { myTheme }: any = useContext(themeContext);

  const { t } = useTranslation();

  return (
    <Grid
      item
      className='section-border'
      // sm={12}
      // md={4.8}
      lg={lg}
      xl={xl}
      sx={(theme) => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        {t('Shared information')}
      </Typography>
      <Grid container mt='21px' rowGap='20px'>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Gender')}</Typography>
          <Select
            sx={{
              borderRadius: '10px',
              '& fieldset': {
                border: '0',
              },
              '&.Mui-disabled fieldset': {
                border: 'none',
              },
            }}
            variant='outlined'
            placeholder={t('Select Gender')}
            name='gender'
            value={t(state.gender)}
            onChange={(e: any) =>
              dispatch({
                type: 'privateInformation',
                field: 'gender',
                value: e.target.value,
              })
            }
            disabled={disable}
            error={hasError(state.gender)}
            className='error'
          >
            <MenuItem value='Male'>{t('Male')}</MenuItem>
            <MenuItem value='Female'>{t('Female')}</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>
            {t('Business Mobile Number')}
          </Typography>
          <PhoneInput
            inputStyle={{ border: 'none', background: 'transparent' }}
            buttonStyle={{ border: 'none', borderRight: '1px solid rgba(9, 44, 76, 0.1)' }}
            containerStyle={{ backgroundColor: '#F7F8FB', borderRadius: '10px' }}
            disabled={disable}
            placeholder={`${t('Enter phone number')}`}
            value={state.businessMobileNumber}
            onChange={(e) =>
              dispatch({
                type: 'privateInformation',
                field: 'businessMobileNumber',
                value: e,
              })
            }
            country={'ca'}
            containerClass={
              myTheme.name + (hasError('phoneNumber') ? 'error' : '')
            }
            isValid={(value, country: any) => {
              let isValid = true;
              if (!disable && value && value.length > country.countryCode.length) {
                isValid = false;
                if (!isValidInternationalPhoneNumber(value, country.iso2.toUpperCase())) {
                  setValidPhone(isValid);
                  return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                } else {
                  let val = "+" + value;
                  const parsedValue = parseMax(val);
                  if (parsedValue !== undefined && parsedValue.getType() !== undefined) {
                    isValid = true;
                    setValidPhone(isValid);
                    return isValid;
                  } else {
                    setValidPhone(isValid);
                    return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                  }
                }
              } else {
                setValidPhone(isValid);
                return isValid;
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>
            {t('Office Phone Number')}
          </Typography>
          <PhoneInput
            inputStyle={{ border: 'none', background: 'transparent' }}
            buttonStyle={{ border: 'none', borderRight: '1px solid rgba(9, 44, 76, 0.1)' }}
            containerStyle={{ backgroundColor: '#F7F8FB', borderRadius: '10px' }}
            disabled={disable}
            placeholder={`${t('Enter phone number')}`}
            value={state.businessPhoneNumber}
            onChange={(e) =>
              dispatch({
                type: 'privateInformation',
                field: 'businessPhoneNumber',
                value: e,
              })
            }
            country={'ca'}
            containerClass={
              myTheme.name + (hasError('phoneNumber') ? 'error' : '')
            }
            isValid={(value, country: any) => {
              let isValid = true;
              if (!disable && value && value.length > country.countryCode.length) {
                isValid = false;
                if (!isValidInternationalPhoneNumber(value, country.iso2.toUpperCase())) {
                  setValidPhone(isValid);
                  return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                } else {
                  let val = "+" + value;
                  const parsedValue = parseMax(val);
                  if (parsedValue !== undefined && parsedValue.getType() !== undefined) {
                    isValid = true;
                    setValidPhone(isValid);
                    return isValid;
                  } else {
                    setValidPhone(isValid);
                    return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                  }
                }
              } else {
                setValidPhone(isValid);
                return isValid;
              }
            }}
          />
          <Typography color={'error'} fontSize={12}>
            {errorHelperText(
              hasError('businessPhoneNumber') && t('Phone number is required')
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Site')}</Typography>
          <Select
            sx={{
              borderRadius: '10px',
              '& fieldset': {
                border: '0',
              },
              '&.Mui-disabled fieldset': {
                border: 'none',
              },
            }}
            variant='outlined'
            name='workPlace'
            placeholder={t('Select Site')}
            disabled={disable}
            value={state.workPlace}
            onChange={(e: any) =>
              dispatch({
                type: 'privateInformation',
                field: 'workPlace',
                value: e.target.value,
              })
            }
            error={hasError('workPlace')}
          >
            <MenuItem value='site 1'>{t('site 1')}</MenuItem>
            <MenuItem value='site 2'>{t('site 2')}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Grid>
  );
};

const EmergencyContact = ({
  gap,
  state,
  dispatch,
  disable,
  error,
  lg,
  xl,
  setValidPhone
}: any) => {
  const hasError = (field: any) => {
    return error.includes(field);
  };

  const { myTheme }: any = useContext(themeContext);

  const { t } = useTranslation();

  return (
    <Grid
      item
      className='section-border'
      sm={12}
      md={12}
      lg={lg}
      xl={xl}
      sx={(theme) => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        {t('Emergency contact')}
      </Typography>
      <Grid container mt='21px' rowGap='20px'>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('First Name')}</Typography>
          <TextField
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
            }}
            variant='outlined'
            name='firstName'
            placeholder={`${t('Enter First Name')}`}
            value={state.firstName}
            onChange={(e) =>
              dispatch({
                type: 'emergencyContact',
                field: 'firstName',
                value: e.target.value,
              })
            }
            disabled={disable}
            error={hasError('firstName')}
            helperText={hasError('firstName') && t('First Name is required')}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Last Name')}</Typography>
          <TextField
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
            }}
            variant='outlined'
            name='lastName'
            placeholder={`${t('Enter Last Name')}`}
            value={state.lastName}
            onChange={(e: any) =>
              dispatch({
                type: 'emergencyContact',
                field: 'lastName',
                value: e.target.value,
              })
            }
            disabled={disable}
            error={hasError('lastName')}
            helperText={hasError('lastName') && t('Last Name is required')}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Phone number')}</Typography>
          <PhoneInput
            inputStyle={{ border: 'none', background: 'transparent' }}
            buttonStyle={{ border: 'none', borderRight: '1px solid rgba(9, 44, 76, 0.1)' }}
            containerStyle={{ backgroundColor: '#F7F8FB', borderRadius: '10px' }}
            placeholder={`${t('Enter phone number')}`}
            disabled={disable}
            value={state.phoneNumber}
            onChange={(e) =>
              dispatch({
                type: 'emergencyContact',
                field: 'phoneNumber',
                value: e,
              })
            }
            country={'ca'}
            containerClass={
              myTheme.name + (hasError('phoneNumber') ? 'error' : '')
            }
            isValid={(value, country: any) => {
              let isValid = true;
              if (!disable && value && value.length > country.countryCode.length) {
                isValid = false;
                if (!isValidInternationalPhoneNumber(value, country.iso2.toUpperCase())) {
                  setValidPhone(isValid);
                  return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                } else {
                  let val = "+" + value;
                  const parsedValue = parseMax(val);
                  if (parsedValue !== undefined && parsedValue.getType() !== undefined) {
                    isValid = true;
                    setValidPhone(isValid);
                    return isValid;
                  } else {
                    setValidPhone(isValid);
                    return 'Invalid value: ' + value + ' for ' + country.iso2.toUpperCase();
                  }
                }
              } else {
                setValidPhone(isValid);
                return isValid;
              }
            }}
          />
          <Typography color={'error'} fontSize={12}>
            {errorHelperText(
              hasError('phoneNumber') && t('Phone number is required')
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Email Address')}</Typography>
          <TextField
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
            }}
            disabled={disable}
            variant='outlined'
            name='email'
            placeholder={`${t('Enter email address')}`}
            value={state.email}
            onChange={(e) =>
              dispatch({
                type: 'emergencyContact',
                field: 'email',
                value: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Email color='error' className='10px' />
                </InputAdornment>
              ),
            }}
            error={hasError('email')}
            helperText={hasError('email') && t('Email address is required')}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const initialState = {
  userDetails: {
    employeeDetailId: 4,
    socialSecurityNumber: '',
    personalEmailId: '',
    personalMobileNumber: '',
    dateOfBirth: '',
    preferedLanguage: 'English',
    employeeAddressDto: {
      address: '',
      postCode: '',
      city: '',
      country: '',
    },
    gender: '',
    businessPhoneNumber: '',
    businessMobileNumber: '',
    workPlace: 'site 1',
    emergencyContactDto: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    },
    error: [],
  },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'privateInformation':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'sharedInformation':
      return {
        ...state,
        employeeAddressDto: {
          ...state.employeeAddressDto,
          [action.field]: action.value,
        },
      };
    case 'emergencyContact':
      return {
        ...state,
        emergencyContactDto: {
          ...state.emergencyContactDto,
          [action.field]: action.value,
        },
      };
    case 'serviceData':
      return {
        ...state,
        ...action.value,
      };
    case 'error':
      return {
        ...state,
        error: action.value,
      };
    case 'reset':
      const oldData = action.data ?? state;
      return {
        error: [],
        ...oldData,
      };
    default:
      return state;
  }
};

function Profile({ modal = false }) {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState.userDetails);
  const [tempState, setTempState] = useState<any>({});
  const { showMessage }: any = useSnackbar();
  const [validPhone, setValidPhone] = useState<boolean>(true);

  const bearerToken = sessionStorage.getItem('token_key');
  const empId: any = sessionStorage.getItem('employee_id_key') ? sessionStorage.getItem('employee_id_key') : sessionStorage.getItem('empId_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  const updateProfileData = async () => {
    const {
      error,
      message,
      name,
      code,
      config,
      request,
      response,
      ...restState
    } = state;

    const errorsFound = validateProfileData(restState);

    console.log('error', errorsFound);

    // Additional validation for other fields if needed
    if (errorsFound.length > 0) {
      // Dispatch the error message to the reducer
      dispatch({
        type: 'error',
        value: errorsFound,
      });
      return; // Stop updating the profile data if there are errors
    } else if (!validPhone) {
      showMessage("Please Enter Valid Phone Number", "error");
      return;
    }

    // Clear any existing errors
    dispatch({
      type: 'error',
      value: [],
    });

    let url = 'api/Employee/UpdateProfileTabDetail?id=' + empId;
    /*let responseReturn = await profileService.updateProfileDataRequest(
      url,
      state,
      bearerToken
    );*/

    jwtInterceptor.post(url, state).then((response: any) => {
      showMessage(response.data, 'success');
    });

    //if (responseReturn.status !== 200) navigate("/login", { replace: true });

    setEdit(false);
  };

  const getProfilePrivateData = async () => {
    jwtInterceptor
      .get('api/Employee/GetProfileBottomDetail?id=' + empId)
      .then((response: any) => {
        dispatch({
          type: 'serviceData',
          field: '',
          value: response.data,
        });
        setTempState(response.data);
      });
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getProfilePrivateData();
      } else {
        window.location.replace(base_url + '/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [edit, setEdit] = useState<any>(false);
  if (Object.keys(state).length <= 0) return <span>loading</span>;

  return (
    <Box>
      {!modal && (
        <EditAndSave
          edit={edit}
          setEdit={setEdit}
          onUpdate={() => updateProfileData()}
          onCancel={() => dispatch({ type: 'reset', data: tempState })}
          modal={modal}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} xl={6}>
          <PrivateInformation
            state={state}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
            setValidPhone={setValidPhone}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <SharedInformation
            state={state}
            dispatch={dispatch}
            disable={!edit}
            setValidPhone={setValidPhone}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <EmergencyContact
            state={state.emergencyContactDto}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
            setValidPhone={setValidPhone}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
