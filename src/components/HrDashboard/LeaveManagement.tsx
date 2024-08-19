/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useReducer, useState, useEffect, useRef } from 'react';
import EnhancedTable from '../Global/Table';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BaseModal from '../Global/Modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RoundedChip } from '../Global/Chips';
import DeleteModal from '../Global/DeleteModal';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { hasError, validateCalculate } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../Global/WithSnackbar';
import jwtInterceptor, { jwtLeave } from '../../services/interceptors';

import { Pending } from '@mui/icons-material';
import Select from '../Global/Select';
import CalendarIcon from '../Icon/CalenderIcon';
import BinIcon from '../Icon/BinIcon';
import CircleIcon from "@mui/icons-material/Circle";

interface DataRow {
  fullName: string;
  leave: string;
  startDate: string;
  endDate: string;
  noOfDays: number;
  status: JSX.Element;
  action: JSX.Element;
  searchableText: string;
}

const headCells: { id: string; label: string }[] = [
  {
    id: 'fullName',
    label: 'Full Name',
  },
  {
    id: 'leave',
    label: 'Leave',
  },
  {
    id: 'startingDate',
    label: 'Starting Date',
  },
  {
    id: 'endDate',
    label: 'End Date',
  },
  {
    id: 'noOfDays',
    label: 'No. of days',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'Action',
    label: 'Action',
  },
];

function createData(
  fullName: string,
  leave: string,
  startDate: any,
  endDate: any,
  noOfDays: any,
  status: JSX.Element,
  action: JSX.Element,
  searchableText: string,
): DataRow {
  return { fullName, leave, startDate, endDate, noOfDays, status, action, searchableText };
}

const pending = <RoundedChip status='Pending' color='#E2B93B' />;
const approved = <RoundedChip status='Approved' color='#27AE60' />;
const rejected = <RoundedChip status='Rejected' color='#EB5757' />;

function CellAction({ onDelete }: { onDelete: () => void }) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={onDelete}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

function EmployeeSkillsTable() {
  const [state, dispatch] = useReducer(
    (
      prevState: any,
      action: { type: string; value: any }
    ) => {
      switch (action.type) {
        case 'fullName':
          return { ...prevState, employeeDetailId: action.value };
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
        case 'reset':
          return {
            employeeDetailId: 0,
            leaveTypeId: 0,
            totalDays: 0,
            leaveStatus: 'Approved',
            startDate: '',
            endDate: '',
            isHalfDay: false,
            isIncludingWeekand: false,
            employeeComments: '',
          };
        default:
          throw new Error();
      }
    },
    {
      employeeDetailId: 0,
      leaveTypeId: 0,
      leaveStatus: 'Approved',
      totalDays: 0,
      startDate: '',
      endDate: '',
      isHalfDay: false,
      isIncludingWeekand: false,
      employeeComments: '',
    }
  );

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const tblRows: DataRow[] = [];
  const LeaveTypes: { leaveTypeId: number; leaveType: string }[] = [];
  const initialized = useRef(false);
  const [leavesData, setleavesDataState] = useState<DataRow[]>([]);
  const [leavesListData, setleavesListDataState] = useState<
    {
      leaveTypeId: number;
      leaveType: string;
    }[]
  >([]);
  const [employeeListData, setemployeeListDataState] = useState<
    {
      employeeDetailId: number;
      fullName: string;
    }[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dateError, setDateError] = useState('');
  const [save, setSave] = useState(false);

  const [loading, setLoading] = useState(false);
  const [leaveId, setIdState] = useState<number | null>(null);
  const { showMessage }: any = useSnackbar();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const bearerToken = sessionStorage.getItem('token_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      void GetLeavesListData();
      GetEmployeeListData();
      GetLeavesConfigurationData();
    }
  }, []);

  function onDelete(eId: number) {
    setDeleteOpen((pre) => !pre);
    setIdState(eId);
  }
  function onConfirmationDelete() {
    setDeleteOpen((pre) => !pre);
    deleteEmployeeLeave();
  }

  const deleteEmployeeLeave = () => {
    let url = 'api/HrLeave/DeleteEmployeeLeaveDetail?leaveDetailId=' + leaveId;
    jwtLeave
      .delete(url)
      .then((response) => {
        showMessage(response.data, 'success');
        GetLeavesListData();
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => { setLoading(false) });
  };

  const GetLeavesConfigurationData = () => {
    let url = 'api/LeaveConfiguration/GetAllLeaveConfiguration';
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
      });
  };
  const GetEmployeeListData = () => {
    setLoading(true);

    jwtInterceptor
      .get('api/HrEmployeeDetail/GetEmployeeDetailsList')
      .then((response: any) => {
        if (response.status !== 200) {
          showMessage(response.statusText, 'error');
          window.location.replace(base_url + '/login');
        }
        let rows: {
          employeeDetailId: number;
          fullName: string;
        }[] = [];
        for (var x of response.data) {
          let item = {
            employeeDetailId: x.employeeDetailId,
            fullName: x.fullName,
          };
          rows.push(item);
        }

        setemployeeListDataState(rows);
      })
      .finally(() => setLoading(false));
  };

  const GetLeavesListData = async () => {
    setLoading(true);
    let url = 'api/HrLeave/GetAllEmployeeLeaveList';
    jwtLeave
      .get(url)
      .then((response: any) => {
        for (var x of response.data) {
          let eId = x.leaveDetailId;
          let leaveStatus: any = Pending; // (x.leaveStatus == "Pending"?Pending:(x.leaveStatus=="Approved"?approved:rejected));
          switch (x.leaveStatus) {
            case 'Pending':
              leaveStatus = pending;
              break;
            case 'Approved':
              leaveStatus = approved;
              break;
            case 'Rejected':
              leaveStatus = rejected;
              break;
          }

          // Combine all text for searchable text
          const searchableText = [
            x.fullName,
            x.leaveType,
            x.startDate?.split("T")[0] || '',
            x.endDate?.split("T")[0] || '',
            x.totalDays,
            x.leaveStatus,
          ].join(' ');

          tblRows.push(
            createData(
              x.fullName,
              x.leaveType,
              <Stack direction="row" alignItems="center" gap={1}>
                <CalendarIcon />
                <Box>
                  {dayjs(x.startDate).format('DD MMM, YYYY')}
                </Box>
              </Stack>,
              <Stack direction="row" alignItems="center" gap={1}>
                <CalendarIcon />
                <Box>
                  {dayjs(x.endDate).format('DD MMM, YYYY')}
                </Box>
              </Stack>,
              <Typography sx={{ fontSize: '24px', fontWeight: '600', color: '#E2B93B', ml: '10%' }}>
                {x.totalDays}
              </Typography>,
              <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
                <CircleIcon color={x.leaveStatus === 'Approved' ? "success" : x.leaveStatus === 'Rejected' ? "error" : "warning"} fontSize="inherit" />
                <Typography sx={{ fontSize: 12 }}>{x.leaveStatus}</Typography>
              </Stack>,
              x.leaveStatus === 'Approved' ? <></> : <CellAction onDelete={() => onDelete(x.leaveDetailId)} />,
              searchableText,
            )
          );
        }
        setleavesDataState(tblRows);
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
            // showMessage(response.message, "success");
            showMessage(response.data.message, 'error');
          }
        })
        .catch((err) => {
          showMessage(err.message, 'error');
        })
        .finally(() => setLoading(false));
    }
  };
  const onSubmit = () => {
    createNewLeave();
  };
  const createNewLeave = async () => {
    let url = 'api/HrLeave/CreateEmployeeLeave';

    jwtLeave
      .post(url, state)
      .then((response) => {
        setOpen(false);
        showMessage(response.data, 'success');
        GetLeavesListData();
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={leavesData}
        isAddable={true}
        onAddClick={() => setOpen((pre) => !pre)}
        title='Leave Management'
        btnTitle={'Manual Entry'}
      />
      <BaseModal
        open={open}
        handleClose={() => { setOpen((pre) => !pre); dispatch({ type: "reset", value: undefined }); }}
        title='Leave Management - HR modification'
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
          {/*<Grid item xs={12} sm={6}>
            <Typography variant="SmallBody">{t("First Name")}</Typography>
            <TextField variant="outlined" placeholder="Employee Name" />
  </Grid>*/}
          <Grid item xs={12}>
            <Typography variant='body1'>{t('Employee')}</Typography>
            {/*<Select
            variant="outlined"
            placeholder={t("Select First Name")}
            value={state.fullName}
            onChange={(e) =>
              dispatch({ type: "fullName", value: e.target.value })
            }
            error={hasError("employeeDetailId", errors)}
          >
            {employeeListData.map((item, i) => (
              <MenuItem value={item.employeeDetailId} key={i}>
                {t(item.fullName)}
              </MenuItem>
            ))}
          </Select>  */}
            <Box mt={1} sx={{ width: { sm: '50%' } }}>
              <Select
                variant='standard'
                placeholder={t('Select Employee')}
                value={`${employeeListData.find((item) => { return item.employeeDetailId === state?.employeeDetailId })?.fullName || ''}`}
                onChange={(e: any) =>
                  dispatch({ type: 'fullName', value: e.target.value })
                }
                error={hasError('leaveTypeId', errors)}
                sx={{ width: '100%' }}
                MenuProps={{
                  sx: {
                    maxHeight: '400px',
                  },
                }}
              >
                {employeeListData.map((item, i) => (
                  <MenuItem value={item.employeeDetailId} key={i}>
                    {t(item.fullName)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
          {/*<Grid item xs={12} sm={6}>
            <Typography variant="SmallBody">{t("Last Name")}</Typography>
            <TextField variant="outlined" placeholder="Doe" />
          </Grid>*/}
          <Grid item xs={12} sm={6}>
            <Typography variant='body1'>{t('Leave Type')}</Typography>
            <Select
              variant='outlined'
              placeholder={t('Select leave type')}
              value={`${leavesListData.find((item) => { return item.leaveTypeId === state?.leaveTypeId })?.leaveType || ''}`}
              onChange={(e: any) =>
                dispatch({ type: 'leaveType', value: e.target.value })
              }
              error={hasError('leaveTypeId', errors)}
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                borderRadius: '10px'
              }}
            >
              {leavesListData.map((item, i) => (
                <MenuItem value={item.leaveTypeId} key={i}>
                  {t(item.leaveType)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={3} mt={3}>
            <Typography ml={1}>{t("Leave Status")}</Typography>
            <Stack direction="row" alignItems="center">
              <Checkbox checked={true} />
              <Typography>{t("Approve")}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3} direction='column' mt={1}>
            <Typography textAlign='center' variant='body1'>{t('No. of Days')}</Typography>
            <Typography variant='h5' textAlign='center' color='#E2B93B' mt={1}>
              {state.totalDays}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction='row'
              gap={2}
              alignItems='center'
              justifyContent='space-between'
            >
              <Stack direction='row' gap={1} alignItems='center'>
                <Stack direction='row' gap={'5px'} alignItems='center'>
                  <Checkbox
                    checked={state.halfDay}
                    onChange={(e) =>
                      dispatch({ type: 'halfDay', value: e.target.checked })
                    }
                  />
                  <Typography variant='body2'>{t('Half day')}</Typography>
                </Stack>
                <Stack direction='row' gap={'5px'} alignItems='center'>
                  <Checkbox
                    checked={state.fullDay}
                    onChange={(e) =>
                      dispatch({ type: 'weekends', value: e.target.checked })
                    }
                  />
                  <Typography variant='body2'>
                    {t('Including weekends')}
                  </Typography>
                </Stack>
              </Stack>
              <Button
                variant='outlined'
                onClick={GetCaluclateLeavesData}
                sx={{ padding: '2px 20px', width: 'fit-content' }}
              >
                {t('calculate')}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body1'>{t('Start Date')}</Typography>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <DatePicker
                onChange={(e: any) => dispatch({ type: 'startDate', value: e })}
                format='DD/MM/YYYY'
                value={dayjs(state.startDate)}
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
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body1'>{t('End Date')}</Typography>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <DatePicker
                onChange={(e: any) => dispatch({ type: 'endDate', value: e })}
                format='DD/MM/YYYY'
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
            </LocalizationProvider>
          </Grid>
          {/* FUll width */}
          <Grid item xs={12} mb='12px'>
            <Typography variant='body1'>{t('Comments')}</Typography>
            <TextField
              variant='outlined'
              placeholder={t('Enter comments') ?? ''}
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
      <DeleteModal
        open={deleteOpen}
        onCancel={() => setDeleteOpen((pre) => !pre)}
        //onDelete={() => setDeleteOpen((pre) => !pre)}
        onConfirm={() => onConfirmationDelete()}
        title='Delete Leave'
        message='Are you sure you want to delete this leave?'
      />
    </>
  );
}

export default EmployeeSkillsTable;
