import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState, useRef } from 'react';
import EditAndSave from '../../../Global/EditAndSave';
import { validateProfileData } from '../../../../utils/validation';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../../../../services/interceptors';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../../Global/WithSnackbar';
import Select from '../../../Global/Select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CalendarIcon from '../../../Icon/CalenderIcon';

const ProfileInformation = ({ state, dispatch, disable, lg, xl }: any) => {
  const [contractsListData, setcontractsListDataState] = useState<any>([]);

  const hasError = (field: any) => {
    return state.error.includes(field);
  };

  const { t }: any = useTranslation();

  const GetContractsListData = () => {
    let url = 'api/ContractTypeMasters/GetAllContractType';
    let contracts = [];
    jwtInterceptor.get(url).then((response: any) => {
      for (var x of response.data) {
        let item = {
          contractTypeId: x.contractTypeId,
          contractType: x.contractType,
        };
        contracts.push(item);
      }
      setcontractsListDataState(contracts);
    });
  };

  useEffect(() => {
    GetContractsListData();
  }, [])

  return (
    <Grid item className='section-border' lg={lg} xl={xl} sx={() => ({})}>
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        {t('Profile information')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Grid container mt='21px' gap='20px'>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Employee ID')}</Typography>
            <TextField
              sx={{
                backgroundColor: 'transparent !important',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  borderRadius: '10px',
                  border: '0',
                  outline: 1,
                  outlineColor: '#E0E0E0',
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
              disabled={true}
              value={state.employeeId}
              variant='outlined'
              placeholder={t('Enter Employee ID')}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'employeeId',
                  value: e.target.value,
                })
              }
              helperText={hasError('employeeId') && t('Employee ID is required')}
              error={hasError('employeeId')}
            />
          </Grid>
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
              className='outlined'
              name='fName'
              disabled={disable}
              placeholder={t('Enter First Name')}
              value={state.firstName}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'fName',
                  value: e.target.value,
                })
              }
              helperText={hasError('fName') && t('First Name is required')}
              error={hasError('fName')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Middle Name')}</Typography>
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
              name='MiddleName'
              placeholder={t('Enter Middle Name')}
              disabled={disable}
              value={state.middleName}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'middleName',
                  value: e.target.value,
                })
              }
              helperText={
                hasError('middleName') && t('Middle Name is required')
              }
              error={hasError('middleName')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Contract Type')}</Typography>
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
              disabled={disable}
              value={state.contractType}
              onChange={(e: any) =>
                dispatch({ type: 'contracttype', value: e.target.value })
              }
              error={hasError('contractType')}
              placeholder={t('Select Contract Type')}
            >
              <MenuItem disabled value=''>
                <em>{t('Contract Type')}</em>
              </MenuItem>
              {contractsListData.map((item: any, i: any) => {
                return (
                  <MenuItem value={item.contractType} key={i}>
                    {t(item.contractType)}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const ProfileInformation1 = ({
  state,
  dispatch,
  disable,
  lg,
  xl,
}: any) => {
  const [managersListData, setmangersListDataState] = useState<any>([]);

  const hasError = (field: any) => {
    return state.error.includes(field);
  };

  const { t }: any = useTranslation();

  const GetMangersListData = async () => {
    let url = 'api/HrEmployeeDetail/GetManagerList';
    let mangers = [];
    jwtInterceptor.get(url).then((response: any) => {
      for (var x of response.data) {
        let item = {
          managerId: x.employeeDetailId,
          managerName: x.userName,
        };
        mangers.push(item);
      }

      setmangersListDataState(mangers);
    });
  };

  console.log('TEST state', state);

  useEffect(() => {
    GetMangersListData();
  }, [])

  return (
    <Grid item className='section-border' lg={lg} xl={xl} sx={(theme) => ({})}>
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      ></Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '31px',
        }}
      >
        <Grid container mt='21px' gap='20px'>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Cost Center')}</Typography>
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
              value={state.costCenter}
              variant='outlined'
              placeholder={t('Cost Center')}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'costCenter',
                  value: e.target.value,
                })
              }
              helperText={
                hasError('costCenter') && t('Cost Center is required')
              }
              error={hasError('costCenter')}
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
              className='outlined'
              name='lName'
              disabled={disable}
              placeholder={t('Enter Last Name')}
              value={state.lastName}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'lName',
                  value: e.target.value,
                })
              }
              helperText={hasError('lName') && t('Last Name is required')}
              error={hasError('lName')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Line Manager')}</Typography>
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
              className='outlined'
              name='linemanager'
              placeholder={t('Enter line manager')}
              disabled={disable}
              value={`${managersListData?.find((item: any) => {
                return item?.managerId === state.lineManager;
              })?.managerName || ''
                }`}
              onChange={(e: any) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'linemanager',
                  value: e.target.value,
                })
              }
              helperText={
                hasError('linemanager') && t('Line manager is required')
              }
              error={hasError('linemanager')}
            >
              <MenuItem disabled value=''>
                <em>{t('Line Manager')}</em>
              </MenuItem>
              {managersListData.map((item: any, i: any) => {
                return (
                  <MenuItem value={item.managerId} key={i}>
                    {t(item.managerName)}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Department')}</Typography>
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
              name='department'
              placeholder={t('Enter Department')}
              disabled={disable}
              value={state.department}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'department',
                  value: e.target.value,
                })
              }
              helperText={hasError('department') && t('Department is required')}
              error={hasError('department')}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const ProfileInformation2 = ({
  gap,
  state,
  dispatch,
  disable,
  lg,
  xl,
}: any) => {
  const [rolesListData, setrolesListDataState] = useState<any>([]);

  const hasError = (field: any) => {
    return state.error.includes(field);
  };

  const { t, i18n }: any = useTranslation();

  console.log('TEST state', state);

  const GetRolesListData = async () => {
    let url = 'api/EmployeeRoles/GetRoles';
    let roles = [];

    jwtInterceptor.get(url).then((response: any) => {
      for (var x of response.data) {
        let item = {
          roleType: x.name,
        };
        roles.push(item);
      }
      setrolesListDataState(roles);
    });
  };

  useEffect(() => {
    GetRolesListData();
  }, [])

  return (
    <Grid item className='section-border' lg={lg} xl={xl} sx={(theme) => ({})}>
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      ></Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '31px',
        }}
      >
        <Grid container mt='21px' gap='20px'>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Joining Date')}</Typography>
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
                name='joiningDate'
                value={dayjs(state.dateOfJoining)}
                format='DD/MM/YYYY'
                onChange={(e) =>
                  dispatch({
                    type: 'profileInformation',
                    field: 'joiningDate',
                    value: e && e.toISOString(),
                  })
                }
              />
            </LocalizationProvider>
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
              className='outlined'
              name='email'
              disabled={disable}
              placeholder={t('Enter email')}
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'email',
                  value: e.target.value,
                })
              }
              helperText={hasError('email') && t('Email is required')}
              error={hasError('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Role')}</Typography>
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
              className='outlined'
              name='role'
              placeholder={t('Enter Role')}
              disabled={disable}
              multiple
              value={state.role}
              onChange={(e: any) =>
                dispatch({
                  type: 'profileInformation',
                  field: 'role',
                  value: e.target.value,
                })
              }
              renderValue={(selected: any) => selected.join(', ')}
              helperText={hasError('role') && t('Role is required')}
              error={hasError('role')}
            >
              <MenuItem disabled value=''>
                <em>{t('Roles')}</em>
              </MenuItem>
              {rolesListData.map((item: any, i: any) => (
                <MenuItem value={item.roleType} key={i}>
                  {t(item.roleType)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const ProfileInformation3 = ({
  gap,
  state,
  dispatch,
  disable,
  lg,
  xl,
}: any) => {
  const hasError = (field: any) => {
    return state.error.includes(field);
  };

  const { t, i18n }: any = useTranslation();

  return (
    <Grid item className='section-border' lg={lg} xl={xl} sx={(theme) => ({})}>
      <Typography
        className='LargeBody'
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      ></Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '31px',
        }}
      >
        <Grid container mt='21px' gap='20px'>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Resignation Date')}</Typography>
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
                name='resignationDate'
                value={dayjs(state.resignationDate)}
                format='DD/MM/YYYY'
                onChange={(e) =>
                  dispatch({
                    type: 'profileInformation',
                    field: 'resignationDate',
                    value: e && e.toISOString(),
                  })
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Typography className='SmallBody' fontSize={14} fontWeight={500}>
              {t('Last Working Date')}
            </Typography>
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
                name='lastWorkingDate'
                value={dayjs(state.lastWorkingDate)}
                format='DD/MM/YYYY'
                onChange={(e) =>
                  dispatch({
                    type: 'profileInformation',
                    field: 'lastWorkingDate',
                    // value: e && e.$d.toISOString(),
                    value: e && e.toISOString(),
                  })
                }
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const initialState = {
  userDetails: {
    fullName: '',
    middleName: '',
    department: '',
    designation: '',
    lineManager: 0,
    employeeId: '',
    costCenter: '',
    contractType: '',
    email: '',
    dateOfJoining: '',
    lastWorkingDate: '',
    resignationDate: '',
    role: [],
    error: [],
  },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'profileInformation':
      return {
        ...state,
        [action.field]: action.value,
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

function HRProfile({ modal = false }) {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState.userDetails);
  const [tempState, setTempState] = useState<any>({});
  const { showMessage }: any = useSnackbar();

  const bearerToken = sessionStorage.getItem('token_key');
  const empId: any = sessionStorage.getItem('employee_id_key');
  const selectedEmpString = sessionStorage.getItem('selected_employee_details');
  const selectedEmp = selectedEmpString ? JSON.parse(selectedEmpString) : {};
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

  const getProfileInfoData = async () => {
    jwtInterceptor
      .get('api/HrEmployeeDetail/GetEmployeeDetailsByEmployeeId?EmployeeDetailId=' + empId)
      .then((response: any) => {
        const combinedData = { ...response.data, ...selectedEmp, role: selectedEmp.roleNames ? selectedEmp.roleNames.split(',') : [], };
        dispatch({
          type: 'serviceData',
          field: '',
          value: combinedData,
        });
        setTempState(combinedData);
      });
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getProfileInfoData();
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
        <Grid item xs={12} sm={6} md={3}>
          <ProfileInformation
            state={state}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProfileInformation1
            state={state}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProfileInformation2
            state={state}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProfileInformation3
            state={state}
            dispatch={dispatch}
            disable={!edit}
            error={state.error}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default HRProfile;
