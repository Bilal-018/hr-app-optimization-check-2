import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import RotateRightTwoToneIcon from '@mui/icons-material/RotateRightTwoTone';
import useStyles from './IconStyle';
import jwtInterceptor from '../../services/interceptors';
import { useTheme } from '@mui/material';

interface Certificate {
  id: number;
  name: string;
  renewDate: string;
}

interface Props {
  CERTIFICATIONS: Certificate[];
}

const CertificateRenewal: React.FC<Props> = (props) => {
  const classes = useStyles();
  if (props.CERTIFICATIONS.length === 0) {
    return (
      <Box>
        <Typography variant='body1'>No certificate renewal pending</Typography>
      </Box>
    );
  }

  return (
    <>
      {props?.CERTIFICATIONS?.map((item) => (
        <Stack key={item.id} direction='row' alignItems='center'>
          <Box
            sx={{
              background: '#FFEDED',
              borderRadius: '100%',
              height: '30px',
              width: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px',
            }}
          >
            <RotateRightTwoToneIcon className={classes.IconStyle} />
          </Box>
          <Stack mr={'auto'}>
            <Typography
              className={classes.TypographyFontSize}
              sx={{ fontWeight: 700, fontSize: 14 }}
            >
              {item.name}
            </Typography>
            <Typography
              color={(theme) => theme.palette.action.disabled}
              sx={{ fontWeight: 500, fontSize: 12 }}
            >
              {item.renewDate}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </>
  );
};

const RenewalCertificate: React.FC = () => {
  const initialized = useRef(false);
  const userTheme = useTheme();
  const bearerToken = sessionStorage.getItem('token_key');
  const [monthCertificateRenewal, setMonthcertificateRenewal] = useState<any>(
    []
  );
  const [weekCertificateRenewal, setWeekcertificateRenewal] = useState<any>([]);
  const base_url = process.env.REACT_APP_BASE_URL;

  const getCertificateRenewalDetails = () => {
    jwtInterceptor
      .get(
        'api/EmployeeSkill/GetSkillRenewalDashboardByEmployeeDetailId?EmployeeDetailId=' +
        77
      )
      .then(
        (response: {
          data: { renewalPending30DaysList: any; renewalPending7DaysList: any };
        }) => {
          let renewalPending30DaysList: Certificate[] = [];
          let renewalWeekPendingList: Certificate[] = [];
          for (var x of response.data.renewalPending30DaysList) {
            const renewalDate = new Date(x.renewalDate).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            );
            let item: Certificate = {
              id: x.employeeSkillId,
              name: x.skill,
              renewDate: renewalDate,
            };
            renewalPending30DaysList.push(item);
          }
          const monthPendingData = (
            <CertificateRenewal CERTIFICATIONS={renewalPending30DaysList} />
          );
          setMonthcertificateRenewal(monthPendingData);
          // eslint-disable-next-line @typescript-eslint/no-redeclare
          for (var x of response.data.renewalPending7DaysList) {
            const weekRenewalDate = new Date(x.renewalDate).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            );
            let item: Certificate = {
              id: x.employeeSkillId,
              name: x.skill,
              renewDate: weekRenewalDate,
            };
            renewalWeekPendingList.push(item);
          }
          const weekPendingData = (
            <CertificateRenewal CERTIFICATIONS={renewalWeekPendingList} />
          );
          setWeekcertificateRenewal(weekPendingData);
        }
      );
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getCertificateRenewalDetails();
      } else {
        window.location.href= base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      flex={1}
      boxShadow={'0px 3.5px 5.5px 0px #91919114'}
      py={2.5}
      px={{ xs: '12px', md: 2.5 }}
      borderRadius={3}
      bgcolor={userTheme.palette.mode === 'dark' ? '' : 'white'}
      maxWidth={'282px'}
    >
      <Typography variant='h6' sx={{ display: { xs: 'none', md: 'block' } }} fontWeight={600}>
        Certificate renewal
      </Typography>
      <Typography fontSize={18} sx={{ display: { xs: 'block', md: 'none' } }} fontWeight={600}>
        Certificate renewal
      </Typography>

      <Typography
        style={{ fontSize: '0.6rem' }}
        color={(theme) => theme.palette.action.disabled}
        sx={{ fontWeight: 600, mb: 2, mt: 1 }}
      >
        Less than a week
      </Typography>
      <Stack gap={2}>{weekCertificateRenewal}</Stack>
      <Typography
        style={{ fontSize: '0.6rem' }}
        color={(theme) => theme.palette.action.disabled}
        sx={{ fontWeight: 600, my: 2 }}
      >
        1 Month
      </Typography>
      <Stack gap={2}>{monthCertificateRenewal}</Stack>
    </Box>
  );
};

export default RenewalCertificate;
