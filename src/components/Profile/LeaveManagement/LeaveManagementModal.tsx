/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import BaseModal from '../../Global/Modal';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BasicTabs from '../../Global/BasicTabs';
import { Box } from '@mui/system';
import EnhancedTable from '../../Global/Table';
import { useTranslation } from 'react-i18next';
import { jwtLeave } from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import { UserImage } from '../../Navigation/Topbar/UserInfo/UserInfo';
import AvatarGroupBy from '../../Global/AvatarGroupBy';

const dummyImages = [
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
  'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
];

const Employee = ({ data, setData }: any) => {
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const { showMessage }: any = useSnackbar();

  const { t } = useTranslation();
  const GetLeavesConfigurationData = () => {
    let url = 'api/LeaveConfiguration/GetAllLeaveConfiguration';
    jwtLeave
      .get(url)
      .then((response) => {
        let LeaveTypes = [];
        for (var x of response.data) {
          let item = {
            leaveTypeId: x.leaveTypeId,
            leaveType: x.leaveType,
          };
          LeaveTypes.push(item);
        }
        setLeaveTypes(LeaveTypes);
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      });
  };

  useEffect(() => {
    GetLeavesConfigurationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        maxWidth: '620px',
      }}
    >
      <Grid item xs={12} md={6}>
        <Typography className='SmallBody'>{t('First Name')}</Typography>
        <TextField className='outlined' value='Jhon' disabled />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography className='SmallBody'>{t('Last Name')}</Typography>
        <TextField className='outlined' value='Doe' disabled />
      </Grid>
      <Grid item xs={12}>
        <Typography className='SmallBody'>{t('Leave')}</Typography>
        <TextField className='outlined' value='Sick Leave' disabled />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography className='SmallBodyBold'>{t('Starting Date')}</Typography>
        <Box mt={1}>
          <Typography className='SmallBody'>{t('22 Apr, 2022')}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography className='SmallBodyBold'>{t('End date')}</Typography>
        <Box mt={1}>
          <Typography className='SmallBody'>{t('22 Apr, 2022')}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography className='SmallBodyBold'>{t('No. of days')}</Typography>
        <Box mt={1}>
          <Typography className='SmallBody' color='yellow' fontSize={18}>
            {t('3')}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography className='SmallBody'>{t('Employee Comments')}</Typography>
        <TextField
          className='outlined'
          value={t('Input notes here')}
          fullWidth
          multiline
          rows={2}
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <Typography className='Small Body'>{t('Leave Status')}</Typography>
        <Stack
          direction='row'
          gap='5px'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' gap='5px' alignItems='center'>
            <FormControlLabel
              label={t('Rejected')}
              control={<Checkbox color='error' />}
            />

            <FormControlLabel
              label={t('Granted')}
              control={<Checkbox color='success' />}
            />
          </Stack>

          <AvatarGroupBy
            images={dummyImages}
            onClick={(i: any) => { console.log(i) }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Typography className='SmallBody'>{t('Comments')}</Typography>
        <TextField
          className='outlined'
          placeholder={t('Enter comments').toString()}
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );
};

const headCells = [
  {
    id: 'user',
    label: 'User',
  },
  {
    id: 'startingDate',
    label: 'Starting Date',
  },
  {
    id: 'endDate',
    label: 'End date',
  },
  {
    id: 'noOfDays',
    label: 'No. of days',
  },
];

const UserCard = ({ name, img }: any) => (
  <Stack direction='row' gap={2} alignItems='center'>
    <UserImage userPicture={img} />
    <Typography className='smallBody'>{name}</Typography>
  </Stack>
);

function createData(user: any, startingDate: any, endDate: any, noOfDays: any) {
  return {
    user: <UserCard {...user} />,
    startingDate,
    endDate,
    noOfDays: (
      <Typography color='yellow' fontSize={18}>
        {noOfDays}
      </Typography>
    ),
  };
}

const rows = [
  createData(
    {
      name: 'Steeve Farnandas',
      img: 'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
    },
    '22 Apr, 2022',
    '22 Apr, 2022',
    3
  ),
  createData(
    {
      name: 'Steeve Farnandas',
      img: 'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
    },
    '22 Apr, 2022',
    '22 Apr, 2022',
    3
  ),
  createData(
    {
      name: 'Steeve Farnandas',
      img: 'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
    },
    '22 Apr, 2022',
    '22 Apr, 2022',
    3
  ),
  createData(
    {
      name: 'Steeve Farnandas',
      img: 'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
    },
    '22 Apr, 2022',
    '22 Apr, 2022',
    3
  ),
];

const Assets = () => {
  return (
    <>
      <EnhancedTable head={headCells} rows={rows} />;
    </>
  );
};

function LeaveManagementModal({
  open,
  handleClose,
  title,
  onSave,
  data,
  setData,
}: any) {
  const EmployeePanel = <Employee data={data} setData={setData} />;
  const AssetsPanel = Assets();

  return (
    <BaseModal
      open={open}
      handleClose={handleClose}
      title={title}
      onSave={onSave}
      sx={{
        maxWidth: 'fit-content',
      }}
    >
      <BasicTabs
        tabs={['Summary', 'Schedule']}
        tabPanels={[EmployeePanel, AssetsPanel]}
        customTabPanelSx={{
          maxHeight: '600px',
        }}
      />
    </BaseModal>
  );
}

export default LeaveManagementModal;
