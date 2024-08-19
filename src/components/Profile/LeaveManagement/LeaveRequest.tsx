/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useReducer, useEffect, useState, useRef } from 'react';
import BaseModal from '../../Global/Modal';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import {
  errorHelperText,
  hasError,
  validateCalculate,
} from '../../../utils/validation';
import dayjs from 'dayjs';
import { useSnackbar } from '../../Global/WithSnackbar';
import jwtInterceptor, { jwtLeave } from '../../../services/interceptors';
import { useTranslation } from 'react-i18next';
import Select from '../../Global/Select';
import CalendarIcon from '../../Icon/CalenderIcon';

const newLeaveItem = {
  employeeDetailId: 0,
  leaveTypeId: 0,
  totalDays: 0,
  startDate: '2023-07-20T01:41:26.427Z',
  endDate: '2023-07-20T01:41:26.427Z',
  isHalfDay: true,
  isIncludingWeekand: true,
  employeeComments: 'string',
  lineManagerId: 0,
};

function LeaveRequest({ open, onClose, onSave }: any) {
  const LeaveTypes: any = [];
  const initialized = useRef(false);
  const [leavesListData, setleavesListDataState] = useState<any>([]);
  const [newLeaveData, setnewLeaveDataState] = useState<any>(newLeaveItem);
  const [managersListData, setmangersListDataState] = useState<any>([]);
  const [save, setSave] = useState<any>(false);
  const [errors, setErrors] = useState<any>([]);
  const [dateError, setDateError] = useState<any>('');
  const { showMessage }: any = useSnackbar();
  const [loading, setLoading] = useState<any>(false);

  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const empToken = JSON.parse(sessionStorage.getItem('token') ?? '{}');

  const employeeManagerId = empToken?.employeedetail.managerId;


  const initialState = {
    employeeDetailId: empId,
    leaveTypeId: 0,
    totalDays: 0,
    startDate: '',
    endDate: '',
    isHalfDay: false,
    isIncludingWeekand: false,
    employeeComments: 'string',
    lineManagerId: 0,
  };

  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'leaveType':
          return { ...prevState, leaveTypeId: action.value };
        case 'startDate': {
          let sDate =
            action.value.$y +
            '-' +
            ('0' + (action.value.$M + 1)).slice(-2) +
            '-' +
            ('0' + action.value.$D).slice(-2);
          return { ...prevState, startDate: sDate };
        }
        case 'endDate': {
          let eDate =
            action.value.$y +
            '-' +
            ('0' + (action.value.$M + 1)).slice(-2) +
            '-' +
            ('0' + action.value.$D).slice(-2);
          return { ...prevState, endDate: eDate };
        }
        case 'halfDay':
          return {
            ...prevState,
            isHalfDay: action.value,
          };
        case 'weekends':
          return {
            ...prevState,
            isIncludingWeekand: action.value,
          };
        case 'totalDays':
          return {
            ...prevState,
            totalDays: action.value,
          };
        case 'comments':
          return {
            ...prevState,
            employeeComments: action.value,
          };
        case 'manager':
          return {
            ...prevState,
            lineManagerId: action.value,
          };
        case 'reset':
          return initialState;

        default:
          throw new Error();
      }
    }, initialState
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      GetLeavesConfigurationData();
      void GetMangersListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetLeavesConfigurationData = () => {
    let url =
      'api/EmployeeLeave/GetLeaveTypeListByGenderRestriction?EmployeeDetailId=' +
      empId;
    setLoading(true);
    jwtLeave
      .get(url)
      .then((response) => {
        for (var x of response.data) {
          let item = {
            leaveTypeId: x.leaveTypeId,
            leaveType: x.leaveType,
          };
          LeaveTypes.push(item);
        }
        setleavesListDataState(LeaveTypes);
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const checkIsEndDateIsAfterStartDate = () => {
    const { startDate, endDate } = state;
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      setDateError('End date should be after start date or same as start date');
      return false;
    }
    setDateError('');
    return true;
  };

  const GetCaluclateLeavesData = async () => {
    const { leaveTypeId, startDate, endDate } = state;

    const errors = validateCalculate({ leaveTypeId, startDate, endDate });

    if (errors.length > 0 || !checkIsEndDateIsAfterStartDate()) {
      setErrors(errors);
    } else {
      setErrors([]);
      let calculateLeaves = {
        employeeDetailId: state.employeeDetailId,
        leaveTypeId: state.leaveTypeId,
        startDate: state.startDate,
        endDate: state.endDate,
        isHalfDay: state.isHalfDay,
        isIncludingWeekand: state.isIncludingWeekand,
      };

      let url = 'api/EmployeeLeave/GetCalculateDays';

      jwtLeave
        .post(url, calculateLeaves)
        .then((response) => {
          if (response && response.data.statusCode === 200) {
            if (response.data.data.leaveCount <= 0)
              showMessage(response.data.message, 'error');
            else {
              dispatch({
                type: 'totalDays',
                value: response.data.data.leaveCount
                  ? response.data.data.leaveCount
                  : 0,
              });
              setSave(true);
            }
          } else {
            showMessage(response.data.message, 'error');
          }
        })
        .catch((err) => {
          showMessage(err.message, 'error');
        })
        .finally(() => setLoading(false));
    }
  };

  const createNewLeave = async () => {
    setLoading(true);
    let url = 'api/EmployeeLeave/CreateEmployeeLeave';

    jwtLeave
      .post(url, state)
      .then((res) => {
        onClose();
        setSave(false);
        onSave();
        dispatch({ type: 'reset' });
        showMessage(res.data, 'success');
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const GetMangersListData = async () => {
    let url = 'api/HrEmployeeDetail/GetManagerList';
    let mangers = [];
    jwtInterceptor
      .get(url)
      .then((response: any) => {
        for (var x of response.data) {
          let item = {
            managerId: x.employeeDetailId,
            managerName: x.userName,
          };
          mangers.push(item);
        }
        setmangersListDataState(mangers);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });
  };

  const onSubmit = () => {
    createNewLeave();
    setStartDate(null);
  };

  const closeModal = () => {
    onClose();
    setStartDate(null);
    dispatch({ type: 'reset' });
  }

  const { t, i18n } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <BaseModal
      open={open}
      handleClose={closeModal}
      onSave={onSubmit}
      showSaveButton={save}
    >
      <Grid
        container
        spacing={2}
        sx={{
          overflowX: 'hidden',
        }}
      >
        <Grid item xs={6}>
          <Typography className='SmallBody'>{t('Leave Type')}</Typography>

          <Select
            variant='outlined'
            placeholder={t('Select leave type')}
            value={`${leavesListData?.find((item: any) => {
              return item?.leaveTypeId === state?.leaveTypeId;
            })?.leaveType || ''
              }`}
            onChange={(e: any) => {
              dispatch({ type: 'leaveType', value: e.target.value });
            }}
            error={hasError('leaveTypeId', errors)}
            sx={{
              boxShadow: 'none',
              '.MuiOutlinedInput-notchedOutline': {
                border: 0,
              },
              borderRadius: '10px'
            }}
          >
            {leavesListData.map((item: any, i: any) => (
              <MenuItem value={item.leaveTypeId} key={i}>
                {t(item.leaveType)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Typography className='SmallBody'>{t('Leave calculator')}</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h5' ml='10%' color='#E2B93B' mt={2}>
              {state.totalDays}
            </Typography>
            <Button
              variant='outlined'
              onClick={GetCaluclateLeavesData}
              sx={{ padding: '2px 20px', width: 'fit-content' }}
            >
              {t('calculate')}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.halfDay}
                onChange={(e) =>
                  dispatch({ type: 'halfDay', value: e.target.checked })
                }
              />
            }
            label={t('Half Day')}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={state.fullDay}
                onChange={(e) =>
                  dispatch({ type: 'weekends', value: e.target.checked })
                }
              />
            }
            label={t('Include Weekends')}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography className='SmallBody'>{t('Line Manager')}</Typography>
          <Select
            disabled={true}
            style={{
              background: 'transparent',
              outline: 'none',
            }}
            variant='outlined'
            placeholder={t('Select Line Manager')}
            value={`${managersListData?.find((item: any) => {
              return item?.managerId === employeeManagerId;
            })?.managerName || ''
              }`}
            sx={{
              borderRadius: '10px'
            }}
          >
            <MenuItem disabled value=''>
              <em>{t('Manager')}</em>
            </MenuItem>
            {managersListData.map((item: any, i: any) => (
              <MenuItem value={item.managerId} key={i}>
                {t(item.managerName)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Typography className='SmallBody'>{t('Starting Date')}</Typography>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <DatePicker
              onChange={(e: Date | null) => { dispatch({ type: 'startDate', value: e }); setStartDate(e); }}
              format='DD/MM/YYYY'
              disablePast
              slots={{
                openPickerIcon: CalendarIcon
              }}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                borderRadius: '10px'
              }}
            />
            {hasError('startDate', errors) &&
              errorHelperText('Start Date is required')}
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <Typography className='SmallBody'>{t('End Date')}</Typography>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <DatePicker
              onChange={(e) => dispatch({ type: 'endDate', value: e })}
              format='DD/MM/YYYY'
              disablePast
              minDate={startDate}
              slots={{
                openPickerIcon: CalendarIcon
              }}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                borderRadius: '10px'
              }}
            />
            {hasError('endDate', errors) &&
              errorHelperText('End Date is required')}
            {dateError && errorHelperText(dateError)}
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} mb='12px'>
          <Typography className='SmallBody'>{t('Comments')}</Typography>
          <TextField
            variant='outlined'
            placeholder={`${t('Enter comments')}`}
            multiline
            rows={3}
            onChange={(e) =>
              dispatch({ type: 'comments', value: e.target.value })
            }
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
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}

export default LeaveRequest;
