/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useReducer, useEffect, useState, useRef } from 'react';
import EnhancedTable from '../Global/Table';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  alpha,
  Stack
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
// import ShareIcon from '@mui/icons-material/Share';
import PreviewIcon from '../../assets/images/previewIcon.svg';
import { Circle } from '@mui/icons-material';
import BaseModal from '../Global/Modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteModal from '../Global/DeleteModal';
import jwtInterceptor from '../../services/interceptors';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../Global/WithSnackbar';
import {
  errorHelperText,
  validateEmployeeInfo,
  validateEmployeeResignationInfo,
} from '../../utils/validation';
import { useTranslation } from 'react-i18next';
import CountrySelect from '../Global/CountryDropdown';
import Select from '../Global/Select';
import PropTypes from 'prop-types';
import ViewIcon from '../Icon/ViewIcon';
import BinIcon from '../Icon/BinIcon';
import EditIcon from '../Icon/EditIcon';
import CalendarIcon from '../Icon/CalenderIcon';

const headCells = [
  {
    id: 'employeeId',
    label: 'Employee ID',
  },
  {
    id: 'fullName',
    label: 'Full Name',
  },
  {
    id: 'department',
    label: 'Department',
  },
  {
    id: 'lineManager',
    label: 'Line Manager',
  },
  {
    id: 'startingDate',
    label: 'Starting Date',
  },
  {
    id: 'role',
    label: 'Roles',
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
  employeeId: any,
  fullName: any,
  department: any,
  lineManager: any,
  startingDate: any,
  role: any,
  status: any,
  Action: any,
  searchableText: string,
) {
  return {
    employeeId,
    fullName,
    department,
    lineManager,
    startingDate,
    role,
    status,
    Action,
    searchableText,
  };
}

function Status({ status }: any) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
      }}
    >
      <Circle
        color={status === true || status === 'Active' ? 'success' : 'error'}
        className='5px'
        style={{ fontSize: '12px' }}
      />
      <Typography fontSize='14px' fontWeight='500'>{t(status)}</Typography>
    </Box>
  );
}

function CellAction({
  onPreview,
  onShare,
  onDelete,
  onEdit,
  onDocument,
  onAsset,
}: any) {
  const { t } = useTranslation();

  return (
    <Box className='action-icon-rounded'>
      <Tooltip title={t('View Preview')} placement='top'>
        <Button onClick={onPreview}>
          <ViewIcon />
        </Button>
      </Tooltip>
      <Tooltip title={t('Edit')} placement='top'>
        <Button onClick={onEdit}>
          <EditIcon />
        </Button>
      </Tooltip>
      <Tooltip title={t('Delete')} placement='top'>
        <Button onClick={onDelete}>
          <BinIcon />
        </Button>
      </Tooltip>
    </Box>
  );
}

const initialState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfJoining: null,
  contractType: '',
  lineManager: 0,
  email: '',
  department: '',
  gender: '',
  costCenter: '',
  roleNames: [],
  designation: '',
  errors: [],
  status: '',
  country: '',
  resignationDate: null,
  lastWorkingDate: null,
};

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function EmployeeSkillsTable() {
  //
  // const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  // const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  //
  const [open, setOpen] = useState<any>(false);
  const [deleteModal, setDeleteModal] = useState<any>(false);
  const [shareModal, setShareModal] = useState(false);
  const initialized = useRef(false);

  const tblRows: any = [];

  const [employeeData, setemployeeDataState] = useState<any>([]);
  const [managersListData, setmangersListDataState] = useState<any>([]);
  const [contractsListData, setcontractsListDataState] = useState<any>([]);

  const [departmentsListData, setdepartmentsListDataState] = useState<any>([]);
  const [gendersListData, setgendersListDataState] = useState<any>([]);
  const [rolesListData, setrolesListDataState] = useState<any>([]);
  const [id, setIdState] = useState<any>(0);

  const [activeEmployeId, setActiveEmployeId] = useState<any>(0);
  const [btnType, setbtnTypeState] = useState<any>('Add');
  const [modelType, setmodelTypeState] = useState<any>('');
  const [isAdd, setIsAdd] = useState<any>(false);

  const [loading, setLoading] = useState<any>(false);

  const navigate = useNavigate();
  const { showMessage }: any = useSnackbar();
  const [activeTab, setActiveTab] = useState<any>(0);
  const [showPreview, setShowPreview] = useState<any>(false);

  const handleChange1 = (event: any, newValue: any) => {
    setActiveTab(newValue);
  };

  const bearerToken = sessionStorage.getItem('token_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case 'costcenter':
        return { ...prevState, costCenter: action.value };
      case 'firstname':
        return { ...prevState, firstName: action.value };
      case 'lastname':
        return { ...prevState, lastName: action.value };
      case 'status':
        return { ...prevState, status: action.value };
      case 'country':
        return { ...prevState, country: action.value };
      case 'middlename':
        return {
          ...prevState,
          middleName: action.value,
        };
      case 'joiningdate':
        return { ...prevState, dateOfJoining: action.value };
      case 'contracttype':
        return {
          ...prevState,
          contractType: action.value,
        };
      case 'lineManager':
        return {
          ...prevState,
          lineManager: action.value,
        };
      case 'email':
        return {
          ...prevState,
          email: action.value,
        };
      case 'department':
        let newArray = departmentsListData.filter(function (el: any) {
          return el.department == action.value;
        });
        return {
          ...prevState,
          department: action.value,
          costCenter: newArray.length > 0 ? newArray[0].costCenter : '',
        };
      case 'roleType':
        return {
          ...prevState,
          roleNames: action.value,
        };
      case 'designation':
        return {
          ...prevState,
          designation: action.value,
        };
      case 'gender':
        return {
          ...prevState,
          gender: action.value,
        };
      case 'errors':
        return {
          ...prevState,
          errors: action.value,
        };
      case 'resignationDate':
        return { ...prevState, resignationDate: action.value };
      case 'lastWorkingDate':
        return { ...prevState, lastWorkingDate: action.value };
      case 'reset':
        return initialState;
      default:
        throw new Error();
    }
  }, initialState);

  console.log('===>', state);

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetEmployeeListData();
        GetMangersListData();
        GetRolesListData();
        GetDepartmentsListData();
        GetContractsListData();
        GetGenderData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
  }, []);

  const { t, i18n } = useTranslation();

  const GetEmployeeListData = async () => {
    setLoading(true);

    jwtInterceptor
      .get('api/HrEmployeeDetail/GetEmployeeDetailsList')
      .then((response: any) => {
        if (response.status !== 200) {
          showMessage(response.statusText, 'error');
          window.location.replace(base_url + '/login');
        }

        for (var x of response.data) {
          let eId = x.employeeDetailId;
          let item = x;

          // Combine all text for searchable text
          const searchableText = [
            x.employeeId,
            x.fullName,
            x.department,
            x.lineManagerName,
            x.roleNames,
            x.dateOfJoining?.split("T")[0] || '',
            x.status,
          ].join(' ');

          tblRows.push(
            createData(
              x.employeeId,
              x.fullName,
              x.department,
              x.lineManagerName,
              <Stack direction="row" alignItems="center" gap={1}>
                <CalendarIcon />
                <Box>
                  {dayjs(x.dateOfJoining).format('DD MMM, YYYY')}
                </Box>
              </Stack>,
              x.roleNames,
              <Status status={x.status} />,
              <CellAction
                onShare={() => {
                  console.log(' TEST share', item);
                  setShareModal(true);
                }}
                onEdit={() => {
                  console.log(' TEST EDIT', item);
                  onEdit('Edit', item);
                }}
                onPreview={() => handlePreviewClick(item)}
                onDelete={() => onDelete(item)}
              />,
              searchableText,
            )
          );
        }

        setemployeeDataState(tblRows);
      })
      .finally(() => setLoading(false));
  };

  const GetMangersListData = async () => {
    let url = 'api/HrEmployeeDetail/GetManagerList';
    let mangers = [];
    jwtInterceptor.get(url).then((response: any) => {
      // if (response.data.Success) {
      for (var x of response.data) {
        let item = {
          managerId: x.employeeDetailId,
          managerName: x.userName,
        };
        mangers.push(item);
      }

      setmangersListDataState(mangers);
      //}
    });
  };

  const GetGenderData = async () => {
    let url = 'api/GenderMaster/GetAllGenderMasters';
    let genderList = [];
    jwtInterceptor.get(url).then((response: any) => {
      setgendersListDataState(response.data);
    });
  };

  const GetContractsListData = async () => {
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

  const GetDepartmentsListData = async () => {
    let url = 'api/DepartmentMaster/GetAllDepartmentMasterList';
    // let response = await hrService.GetmanagersListDataRequest(url, bearerToken);
    let departments = [];
    jwtInterceptor.get(url).then((response: any) => {
      for (var x of response.data) {
        let item = {
          departmentId: x.departmentId,
          department: x.department,
          costCenter: x.costCenter,
        };
        departments.push(item);
      }

      setdepartmentsListDataState(response.data);
    });
  };

  const GetRolesListData = async () => {
    let url = 'api/EmployeeRoles/GetRoles';
    //let response = await hrService.GetRolesListDataRequest(url, bearerToken);
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

  const createNewemployee = async () => {
    const newEmployeeItem = {
      employeeId: state.employeeId,
      firstName: state.firstName,
      middleName: state.middleName,
      lastName: state.lastName,
      dateOfJoining: state.dateOfJoining,
      contractType: state.contractType,
      lineManager: state.lineManager,
      email: state.email,
      department: state.department,
      costCenter: state.costCenter,
      gender: state.gender,
      status: state.status,
      country: state.country,
      roleNames:
        state.roleNames.length > 1
          ? state.roleNames.join(',')
          : state.roleNames[0],
      designation: state.designation,
    };
    let url = 'api/HrEmployeeDetail/AddEmployeeDetails';

    jwtInterceptor.post(url, newEmployeeItem).then((response: any) => {
      showMessage(response.data, 'success');
      GetEmployeeListData();
    });

    setOpen((pre: any) => !pre);
  };

  const updatEmployee = async () => {
    const updateEmployeeItem = {
      employeeDetailId: id,
      employeeId: state.employeeId,
      firstName: state.firstName,
      middleName: state.middleName,
      lastName: state.lastName,
      dateOfJoining: state.dateOfJoining,
      contractType: state.contractType,
      lineManager: state.lineManager,
      email: state.email,
      department: state.department,
      costCenter: state.costCenter,
      gender: state.gender,
      status: state.status,
      country: state.country,
      roleNames:
        state.roleNames.length > 1
          ? state.roleNames.join(',')
          : state.roleNames[0],
      designation: state.designation,
    };

    console.log(' TEST UPDADATE', updateEmployeeItem);

    let url = 'api/HrEmployeeDetail/UpdateEmployeeDetails';
    jwtInterceptor
      .post(url, updateEmployeeItem)
      .then(async (response: any) => {
        await GetEmployeeListData();
        showMessage(response.data, 'success');
      })
      .catch((error: any) => {
        console.error('Update failed:', error);
      });
    setOpen((pre: any) => !pre);
    dispatch({ type: 'reset' });
  };

  const updatEmployeeResignation = async () => {
    const updateEmployeeItem = {
      employeeDetailId: id,
      employeeId: state.employeeId,
      firstName: state.firstName,
      middleName: state.middleName,
      lastName: state.lastName,
      dateOfJoining: state.dateOfJoining,
      contractType: state.contractType,
      lineManager: state.lineManager,
      email: state.email,
      department: state.department,
      costCenter: state.costCenter,
      gender: state.gender,
      status: state.status,
      country: state.country,
      roleNames:
        state.roleNames.length > 1
          ? state.roleNames.join(',')
          : state.roleNames[0],
      designation: state.designation,
      lastWorkingDate: state.lastWorkingDate,
      resignationDate: state.resignationDate,
    };
    console.log('RESIGNATION UPDATE', updateEmployeeItem);
    let url = 'api/HrEmployeeDetail/UpdateEmployeeDetails';
    jwtInterceptor.post(url, updateEmployeeItem).then((response: any) => {
      showMessage(response.data, 'success');
      GetEmployeeListData();
    });
    setOpen((pre: any) => !pre);
  };

  const deleteEmployee = async () => {
    let url =
      'api/HrEmployeeDetail/DeleteEmployeeDetails?EmployeeDetailId=' + id;
    jwtInterceptor.delete(url).then((response: any) => {
      showMessage(response.data, 'success');
      GetEmployeeListData();
    });
  };

  const onSubmit = () => {
    // Exclude middleName from the rest object for general validation
    const { middleName, ...restForGeneralValidation } = state;
    // For resignation validation, include resignationDate and lastWorkingDate
    const { resignationDate, lastWorkingDate } = state;
    const restForResignationValidation = {
      ...restForGeneralValidation,
      resignationDate,
      lastWorkingDate,
    };

    console.log(' 606', {
      middleName,
      resignationDate,
      lastWorkingDate,
      ...restForGeneralValidation,
    });

    if (btnType === 'Edit') {
      if (activeTab === 0) {
        const foundErrors = validateEmployeeInfo(restForGeneralValidation);
        console.log(' TEST ERRORS', foundErrors);

        if (foundErrors.length > 0) {
          dispatch({ type: 'errors', value: foundErrors });
          return;
        }
        updatEmployee();
      } else {
        const foundErrors = validateEmployeeResignationInfo(
          restForResignationValidation
        );
        console.log(' TEST ERRORS', foundErrors);
        if (foundErrors.length > 0) {
          dispatch({ type: 'errors', value: foundErrors });
          return;
        }
        updatEmployeeResignation();
      }
    } else {
      const foundErrors = validateEmployeeInfo(restForGeneralValidation);
      console.log(' TEST ERRORS', foundErrors);

      if (foundErrors.length > 0) {
        dispatch({ type: 'errors', value: foundErrors });
        return;
      }
      createNewemployee();
    }
    dispatch({ type: 'reset' });
  };

  function openModel() {
    setOpen((pre: any) => !pre);
    setmodelTypeState('Add New Employee');
    setIsAdd(true);
  }

  const handleShare = async () => {
    //handle share function code here
    console.log('inside the handleshare function');
  };

  //

  // const openEmployeeModal = (row: any) => {
  //   setSelectedEmployee(row);
  //   setEmployeeModalOpen(true);
  // };

  // const closeEmployeeModal = () => {
  //   setEmployeeModalOpen(false);
  //   setSelectedEmployee(null);
  // };

  function onEdit(from: any, item: any) {
    setOpen(true);
    setbtnTypeState('Edit');
    console.log(' FORM HERE', from);
    console.log(' TEST EDIT', item);
    const lastWorkingDate = dayjs(state.lastWorkingDate);
    console.log('--->', lastWorkingDate);
    setIdState(item.employeeDetailId);
    setActiveEmployeId(item.employeeId);

    dispatch({ type: 'firstname', value: item.firstName });
    dispatch({ type: 'middlename', value: item.middleName });
    dispatch({ type: 'lastname', value: item.lastName });
    dispatch({ type: 'joiningdate', value: item.dateOfJoining });
    dispatch({ type: 'contracttype', value: item.contractType });

    dispatch({ type: 'email', value: item.email });
    dispatch({ type: 'gender', value: item.gender });

    dispatch({ type: 'costcenter', value: item.costCenter });

    dispatch({ type: 'status', value: item.status });

    dispatch({ type: 'country', value: item.country });

    dispatch({ type: 'lineManager', value: item.lineManager });
    dispatch({ type: 'lastWorkingDate', value: item.lastWorkingDate });
    dispatch({ type: 'resignationDate', value: item.resignationDate });

    dispatch({
      type: 'roleType',
      value:
        typeof item.roleNames === 'string'
          ? item.roleNames.split(',')
          : item.roleNames,
    });
    dispatch({ type: 'department', value: item.department });

    dispatch({ type: 'designation', value: item.designation });

    setmodelTypeState('Update Employee Information');
  }

  function onDelete(eId: any) {
    setDeleteModal((pre: any) => !pre);
    setIdState(eId);
  }

  const handlePreviewClick = (item: any) => {
    setShowPreview(true);
    sessionStorage.setItem('selected_employee_details', JSON.stringify(item));
  }

  function onConfirmationDelete() {
    setDeleteModal((pre: any) => !pre);

    //setemployeeDataState(employeeData.find(x=>x.employeeDetailId != id));
    deleteEmployee();
  }

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    dispatch({
      type: 'roleType',
      value: typeof value === 'string' ? value.split(',') : value,
    });
  };
  const hasError = (field: any) => state.errors.includes(field);

  const handleSort = (property: any, order: any) => { };

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={employeeData}
        isAddable={true}
        onAddClick={() => {
          openModel();
          setbtnTypeState('Add');
          setActiveTab(0);
          setIsAdd(true);
        }}
        title='Employees information'
        loading={loading}
        btnTitle='Add New'
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      />
      {/* <EmployeeInfoModal
        open={employeeModalOpen}
        onClose={closeEmployeeModal}
        employeeData={selectedEmployee}
      /> */}
      <BaseModal
        open={open}
        type={btnType}
        handleClose={() => {
          setOpen((pre: any) => !pre);
          dispatch({ type: 'reset' });
        }}
        onSave={onSubmit}
        title={modelType}
      >
        <Box sx={{ width: '100%' }}>
          {btnType === 'Edit' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={activeTab}
                onChange={handleChange1}
                aria-label='basic tabs example'
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  label='Details'
                  {...a11yProps(0)}
                  sx={{ textTransform: 'capitalize' }}
                />
                <Tab
                  label='Resignation'
                  {...a11yProps(1)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Tabs>
            </Box>
          )}
          <CustomTabPanel value={activeTab} index={0}>
            <Grid
              container
              spacing={2}
              sx={{
                overflowX: 'hidden',
              }}
            >
              {btnType === 'Edit' && (
                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('Employee ID')}{' '}
                  </Typography>
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
                    variant='outlined'
                    placeholder={`${t('')}`}
                    value={btnType === "Edit" ? activeEmployeId : ''}
                    disabled
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Cost centre')}
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
                  disabled
                  variant='outlined'
                  placeholder={`${t('Cost centre')}`}
                  value={state.costCenter}
                  // disabled="true"
                  onChange={(e: any) =>
                    dispatch({ type: 'costcenter', value: e.target.value })
                  }
                  error={hasError('costCenter')}
                  helperText={
                    hasError('costCenter')
                      ? t('Please enter cost center')
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('First Name')}{' '}
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
                  variant='outlined'
                  placeholder={`${t('Enter First Name')}`}
                  value={state.firstName}
                  onChange={(e: any) =>
                    dispatch({ type: 'firstname', value: e.target.value })
                  }
                  error={hasError('firstName')}
                  helperText={
                    hasError('firstName') ? t('Please enter first name') : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  placeholder={`${t('Enter Last Name')}`}
                  value={state.lastName}
                  onChange={(e: any) =>
                    dispatch({ type: 'lastname', value: e.target.value })
                  }
                  error={hasError('lastName')}
                  helperText={
                    hasError('lastName') ? t('Please enter last name') : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Middle Name')}
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
                  variant='outlined'
                  placeholder={`${t('Enter Middle Name')}`}
                  value={state.middleName}
                  onChange={(e) =>
                    dispatch({ type: 'middlename', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Joining Date')}
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
                    name='joiningdate'
                    defaultValue={dayjs(state.dateOfJoining)}
                    format='DD/MM/YYYY'
                    onChange={(e: any) =>
                      dispatch({
                        type: 'joiningdate',
                        value: e.$d.toISOString(),
                      })
                    }
                  />
                </LocalizationProvider>
                {errorHelperText(
                  hasError('dateOfJoining')
                    ? t('Please Select a joining date')
                    : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  value={state.gender}
                  onChange={(e: any) =>
                    dispatch({ type: 'gender', value: e.target.value })
                  }
                  error={hasError('gender')}
                  placeholder={t('Select Gender')}
                >
                  <MenuItem disabled value=''>
                    <em>{t('Gender')}</em>
                  </MenuItem>
                  {gendersListData.map((item: any, i: any) => {
                    return (
                      <MenuItem value={item.gender} key={i}>
                        {t(item.gender)}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errorHelperText(
                  hasError('gender') ? t('Please select a gender') : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Country')}</Typography>

                <CountrySelect
                  dispatch={dispatch}
                  value={state.country}
                  helperText={hasError('country') && t('Country is required')}
                  error={hasError('country')}
                  customFun={(e: any) => {
                    dispatch({ type: 'country', value: e });
                  }}
                />
                {errorHelperText(
                  hasError('country') ? t('Please select a country') : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Contract type')}
                </Typography>

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

                {errorHelperText(
                  hasError('contractType')
                    ? t('Please select contract type')
                    : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Line Manager')}
                </Typography>
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
                  placeholder={t('Select manager')}
                  value={`${managersListData?.find((item: any) => {
                    return item?.managerId === state.lineManager;
                  })?.managerName || ''
                    }`}
                  onChange={(e: any) =>
                    dispatch({ type: 'lineManager', value: e.target.value })
                  }
                  error={hasError('lineManager')}
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
                {errorHelperText(
                  hasError('lineManager') ? t('Please select a manager') : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Email')}</Typography>
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
                  placeholder={`${t('Enter email address')}`}
                  value={state.email}
                  onChange={(e) =>
                    dispatch({ type: 'email', value: e.target.value })
                  }
                  error={hasError('email')}
                  helperText={
                    hasError('email') ? t('Please enter valid email') : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Department')}</Typography>

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
                  placeholder={t('Select Department')}
                  value={state.department}
                  onChange={(e: any) =>
                    dispatch({ type: 'department', value: e.target.value })
                  }
                  error={hasError('department')}
                >
                  <MenuItem disabled value=''>
                    <em>{t('Department')}</em>
                  </MenuItem>
                  {departmentsListData.map((item: any, i: any) => {
                    return (
                      <MenuItem value={item.department} key={i}>
                        {t(item.department)}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errorHelperText(
                  hasError('department')
                    ? t('Please select a department')
                    : null
                )}
              </Grid>{' '}
              <Grid item xs={12} sm={6}>
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
                  multiple
                  displayEmpty
                  variant='outlined'
                  placeholder={t('Select role')}
                  value={state.roleNames}
                  renderValue={(selected: any) => {
                    if (selected.length === 0) {
                      return <em>{t('Roles')}</em>;
                    }

                    return selected.join(', ');
                  }}
                  onChange={handleChange}
                  error={hasError('roleNames')}
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
                {errorHelperText(
                  hasError('roleNames') ? t('Please select a permission') : null
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                  {t('Designation')}
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
                  variant='outlined'
                  placeholder={`${t('Enter Designation')}`}
                  value={state.designation}
                  onChange={(e) =>
                    dispatch({ type: 'designation', value: e.target.value })
                  }
                  error={hasError('designation')}
                  helperText={
                    hasError('designation')
                      ? t('Please enter designation')
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className='SmallBody' fontSize={14} fontWeight={500}>{t('Status')}</Typography>

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
                  value={state.status}
                  onChange={(e: any) =>
                    dispatch({ type: 'status', value: e.target.value })
                  }
                  error={hasError('status')}
                  placeholder={t('Select Status')}
                >
                  <MenuItem disabled value=''>
                    <em>{t('Status')}</em>
                  </MenuItem>
                  <MenuItem value='Active'>{t('Active')}</MenuItem>
                  <MenuItem value='Deactive'>{t('Deactive')}</MenuItem>
                </Select>
                {errorHelperText(
                  hasError('status') ? t('Please select a status') : null
                )}
              </Grid>
            </Grid>
          </CustomTabPanel>

          {btnType === 'Edit' && (
            <CustomTabPanel value={activeTab} index={1}>
              <Grid
                container
                spacing={2}
                sx={{
                  overflowX: 'hidden',
                }}
              >
                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('Employee ID')}{' '}
                  </Typography>
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
                    variant='outlined'
                    placeholder={`${t('EMP - 0026')}`}
                    value={id}
                    onChange={(e: any) =>
                      dispatch({ type: 'firstname', value: e.target.value })
                    }
                    disabled
                    error={hasError('firstName')}
                    helperText={
                      hasError('firstName')
                        ? t('Please enter first name')
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('Joining Date')}
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
                      name='joiningdate'
                      defaultValue={dayjs(state.dateOfJoining)}
                      disabled
                      format='DD/MM/YYYY'
                      onChange={(e: any) =>
                        dispatch({
                          type: 'joiningdate',
                          value: e.$d.toISOString(),
                        })
                      }
                    />
                  </LocalizationProvider>
                  {errorHelperText(
                    hasError('dateOfJoining')
                      ? t('Please Select a joining date')
                      : null
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('First Name')}{' '}
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
                    variant='outlined'
                    placeholder={`${t('Enter First Name')}`}
                    value={state.firstName}
                    onChange={(e: any) =>
                      dispatch({ type: 'firstname', value: e.target.value })
                    }
                    disabled
                    error={hasError('firstName')}
                    helperText={
                      hasError('firstName')
                        ? t('Please enter first name')
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('Last Name')}
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
                    variant='outlined'
                    placeholder={`${t('Enter Last Name')}`}
                    value={state.lastName}
                    onChange={(e) =>
                      dispatch({ type: 'lastname', value: e.target.value })
                    }
                    disabled
                    error={hasError('lastName')}
                    helperText={
                      hasError('lastName') ? t('Please enter last name') : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography className='SmallBody' fontSize={14} fontWeight={500}>
                    {t('Resignation Date ')}
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
                      value={
                        state.resignationDate
                          ? dayjs(state.resignationDate)
                          : null
                      }
                      onChange={(date: any) => {
                        dispatch({
                          type: 'resignationDate',
                          value: date ? date.toISOString() : null,
                        });
                      }}
                      maxDate={dayjs()}
                    // renderInput={(params: any) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {errorHelperText(
                    hasError('resignationDate')
                      ? t('Please Select a resignation date')
                      : null
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
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
                      defaultValue={
                        state.lastWorkingDate
                          ? dayjs(state.lastWorkingDate)
                          : undefined
                      }
                      onChange={(e: any) => {
                        dispatch({
                          type: 'lastWorkingDate',
                          value: e.$d.toISOString(),
                        });
                      }}
                      minDate={dayjs(state.resignationDate)}
                    // renderInput={(params: any) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {errorHelperText(
                    hasError('lastWorkingDate')
                      ? t('Please Select a last working date')
                      : null
                  )}
                </Grid>
              </Grid>
            </CustomTabPanel>
          )}
        </Box>
      </BaseModal>
      <BaseModal
        open={shareModal}
        handleClose={() => setShareModal((prev) => !prev)}
        title='Share payslip'
        yesOrNo={true}
        onSave={() => handleShare()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              {t('Do you want to share the selected payslip ?')}
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <DeleteModal
        open={deleteModal}
        onCancel={() => setDeleteModal((pre: any) => !pre)}
        title=''
        message='Do you want to delete the selected employee?'
        onConfirm={() => onConfirmationDelete()}
      />
    </>
  );
}

export default EmployeeSkillsTable;
