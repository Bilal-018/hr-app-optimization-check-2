/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import CircleIcon from '@mui/icons-material/Circle';

import jwtInterceptor from '../../services/interceptors';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface HighlightedDay {
  id: number;
  day: number;
  month: number;
  year: number;
  isHoliday: boolean;
  isLeave: boolean;
  name: string;
}

let daysToHighlight: HighlightedDay[] = [];
let allLeaves: HighlightedDay[] = [];

const BankHoliday: React.FC<{ name: string }> = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(name)} placement='top'>
      <CircleIcon color='error' fontSize='small' />
    </Tooltip>
  );
};
const LeaveTaken: React.FC<{ name: string }> = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(name)} placement='top'>
      <CircleIcon color='success' fontSize='small' />
    </Tooltip>
  );
};

const customStyles = {
  width: '100%',
  height: 'fit-content',
  '.MuiPickersSlideTransition-root': {
    overflow: 'hidden',
  },
  '.MuiDayCalendar-monthContainer': {
    '& > div': {
      marginBottom: '16px',
    },
  },
  '.MuiDayCalendar-header': {
    justifyContent: 'space-around',
    '& > span': {
      color: '#18A0FB',
      fontWeight: 600,
      fontSize: '18px',
    },
  },
  '.MuiDayCalendar-weekContainer': {
    justifyContent: 'space-around',

    button: {
      height: '100% !important',
    },
  },
  '.MuiPickersCalendarHeader-labelContainer': {
    color: '#18A0FB',
    fontWeight: 600,
    fontSize: '18px',

    path: {
      fill: '#18A0FB',
    },
  },
  '.MuiButtonBase-root.Mui-selected': {
    color: '#fff',
    padding: '5px',
  },
  '.MuiPickersArrowSwitcher-root': {
    scale: '1.1',

    path: {
      fill: '#18A0FB',
    },
  },
  '.MuiPickersCalendarHeader-root': {
    marginBottom: '24px',
  },
  '.MuiPickersCalendarHeader-label': {
    textTransform: 'capitalize',
  },
};

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date: dayjs.Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: HighlightedDay[] }>(
    (resolve, reject) => {
      const timeout = setTimeout(() => {
        daysToHighlight = [];
        for (const x of allLeaves) {
          if (x.month === date.month() && x.year === date.year()) {
            daysToHighlight.push(x);
          }
        }

        resolve({ daysToHighlight });
      }, 500);

      signal.onabort = () => {
        clearTimeout(timeout);
        reject(new DOMException('aborted', 'AbortError'));
      };
    }
  );
}

const initialValue = dayjs(new Date());

const getHighlightContent = (
  isHoliday: boolean,
  isLeave: boolean,
  name: string
) => {
  if (isHoliday) {
    return <BankHoliday name={name} />;
  }

  if (isLeave) {
    return <LeaveTaken name={name} />;
  }

  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ServerDay: React.FC<{
  highlightedDays: HighlightedDay[];
  day: dayjs.Dayjs;
  outsideCurrentMonth: boolean;
}> = (props) => {
  const toDayHighlight = props.highlightedDays.find(
    (highlightedDay) => highlightedDay.day === props.day.date()
  );

  return (
    <Badge
      key={props.day.toString()}
      overlap='circular'
      badgeContent={getHighlightContent(
        toDayHighlight?.isHoliday ?? false,
        toDayHighlight?.isLeave ?? false,
        toDayHighlight?.name ?? ''
      )}
    >
      <PickersDay
        onDaySelect={function (day: unknown): void {
          throw new Error('Function not implemented.');
        }}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        {...props}
        outsideCurrentMonth={props.outsideCurrentMonth}
        sx={{ fontSize: '18px' }}
      />
    </Badge>
  );
};

const DateCalendarServerRequest: React.FC = () => {
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<HighlightedDay[]>([]);
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const {
    i18n: { language },
  } = useTranslation();

  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (bearerToken) {
      getMyLeavesData();
    } else {
      window.location.href = base_url + '/login';
    }
  }, [language]);

  const getMyLeavesData = () => {
    setIsLoading(true);
    jwtInterceptor
      .get(
        'api/PublicHoliday/GetAllLeavesAndPublicHolidays?EmployeeDetaailId=' +
          empId
      )
      .then((response: any) => {
        allLeaves = response.data.map((x: any) => ({
          id: 1,
          day: new Date(x.startDate).getDate(),
          month: new Date(x.startDate).getMonth(),
          year: new Date(x.startDate).getFullYear(),
          isHoliday: x.category === 'Holiday',
          isLeave: x.category === 'Leave',
          name: x.name,
        }));

        const currentMonthLeaves = allLeaves.filter(
          (x) =>
            x.month === initialValue.month() && x.year === initialValue.year()
        );
        setHighlightedDays(currentMonthLeaves);
        setIsLoading(false);
      });
  };

  const fetchHighlightedDays = (date: dayjs.Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  const handleMonthChange = (date: dayjs.Dayjs) => {
    daysToHighlight = allLeaves.filter(
      (x) => x.month === date.month() + 1 && x.year === date.year()
    );
    setHighlightedDays(daysToHighlight);
    setIsLoading(true);
    fetchHighlightedDays(date);
    getMyLeavesData();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        sx={customStyles}
        // slots={{
        //   day: ServerDay,
        // }}
        // slotProps={{
        //   day: {
        //     highlightedDays,
        //   },
        // }}
      />
    </LocalizationProvider>
  );
};

export default DateCalendarServerRequest;
