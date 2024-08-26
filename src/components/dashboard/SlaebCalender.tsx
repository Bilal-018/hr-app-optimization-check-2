import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

import jwtInterceptor from '../../services/interceptors';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

interface HighlightedDay {
  id: number;
  day: number;
  month: number;
  year: number;
  isHoliday: boolean;
  isLeave: boolean;
  name: string;
}

interface LeaveOrHoliday {
  name: string;
  startDate: string;
  endDate: string;
  category: 'Leave' | 'Holiday';
  id: number;
}

let daysToHighlight: HighlightedDay[] = [];
let allLeaves: HighlightedDay[] = [];

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
        allLeaves.forEach((x: HighlightedDay) => {
          if (x.month === date.month() && x.year === date.year()) {
            daysToHighlight.push(x);
          }
        });

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

const DateCalendarServerRequest: React.FC = () => {
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    // eslint-disable-next-line
    jwtInterceptor
      .get(
        'api/PublicHoliday/GetAllLeavesAndPublicHolidays?EmployeeDetaailId=' +
        empId
      )
      .then((response: AxiosResponse<LeaveOrHoliday[]>) => {
        allLeaves = response.data.map((x: LeaveOrHoliday) => ({
          id: 1,
          day: new Date(x.startDate).getDate(),
          month: new Date(x.startDate).getMonth(),
          year: new Date(x.startDate).getFullYear(),
          isHoliday: x.category === 'Holiday',
          isLeave: x.category === 'Leave',
          name: x.name,
        }));

        setIsLoading(false);
      });
  };

  const fetchHighlightedDays = (date: dayjs.Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  const handleMonthChange = (date: dayjs.Dayjs) => {
    daysToHighlight = allLeaves.filter(
      (x: HighlightedDay) => x.month === date.month() + 1 && x.year === date.year()
    );
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
      />
    </LocalizationProvider>
  );
};

export default DateCalendarServerRequest;
