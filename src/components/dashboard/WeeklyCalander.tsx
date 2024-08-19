/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs type
import 'dayjs/locale/fr';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import CircleIcon from '@mui/icons-material/Circle';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../services/interceptors';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

interface HighlightedDay {
  day: number;
  isHoliday: boolean;
  isLeave: boolean;
  name: string;
}

// const customStyles: React.CSSProperties = {
//   width: "100%",
//   height: "fit-content",
//   ".MuiPickersSlideTransition-root": {
//     overflow: "hidden",
//   },
//   ".MuiDayCalendar-monthContainer": {
//     "& > div": {
//       marginBottom: "16px",
//     },
//   },
//   // Add other styles here...
// };

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
  // Add other styles here...
} as React.CSSProperties;

function getCurrentWeekDates(
  startingDate: Date = new Date(), t: any
): { date: Date; day: string }[] {
  const today = new Date(startingDate);
  const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - currentDay); // Set to the first day of the week (Sunday)

  const weekDates: { date: Date; day: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    weekDates.push({
      date: currentDate,
      day: getDayName(currentDate.getDay(), t),
    });
  }

  return weekDates;
}

function getMonthYearString(date: any, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(date);
}

function getDayName(dayIndex: number, t: any): string {
  const days = [
    t('Sunday'),
    t('Monday'),
    t('Tuesday'),
    t('Wednesday'),
    t('Thursday'),
    t('Friday'),
    t('Saturday'),
  ];
  return days[dayIndex];
}

interface ServerDayProps {
  highlightedDays: HighlightedDay[];
  day: Date;
  outsideCurrentMonth: boolean;
}

function ServerDay(props: ServerDayProps): JSX.Element {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const toDayHighlight = highlightedDays.find(
    (highlightedDay) => dayjs(day).date() === highlightedDay.day
  );
  const noop = () => { /* do nothing */ };

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
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        onDaySelect={noop}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        sx={{
          fontSize: '18px',
        }}
      />
    </Badge>
  );
}

const BankHoliday = ({ name }: { name: string }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(name)} placement='top'>
      <CircleIcon color='error' className='10px' />
    </Tooltip>
  );
};

const LeaveTaken = ({ name }: { name: string }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(name)} placement='top'>
      <CircleIcon color='success' className='10px' />
    </Tooltip>
  );
};

const getHighlightContent = (
  isHoliday: boolean,
  isLeave: boolean,
  name: string
): JSX.Element | undefined => {
  if (isHoliday) {
    return <BankHoliday name={name} />;
  }

  if (isLeave) {
    return <LeaveTaken name={name} />;
  }

  return undefined;
};

let daysToHighlight: HighlightedDay[] = [];
let allLeaves: any;
function fakeFetch(
  date: Dayjs,
  { signal }: any
): Promise<{ daysToHighlight: any }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      /* const daysToHighlight = [1, 2, 3].map(() =>
        getRandomNumber(1, daysInMonth)
      );*/
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
  });
}

const initialValue = dayjs(new Date());
export function DateCalendarServerRequest(): JSX.Element {
  const [leaves, setLeaves] = useState<HighlightedDay[]>([]);
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [highlightedDays, setHighlightedDays] = useState<HighlightedDay[]>([]);
  const base_url = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    if (bearerToken) {
      getMyLeavesData();
    } else {
      window.location.href = base_url + '/login';
    }
  }, [bearerToken, language, navigate]);

  const getMyLeavesData = useCallback(() => {
    setIsLoading(true);
    jwtInterceptor
      .get(
        'api/PublicHoliday/GetAllLeavesAndPublicHolidays?EmployeeDetaailId=' +
        empId
      )
      .then((response: any) => {
        daysToHighlight = [];
        allLeaves = [];
        for (const x of response.data) {
          const item: any = {
            day: new Date(x.startDate).getDate(),
            month: new Date(x.startDate).getMonth(),
            year: new Date(x.startDate).getFullYear(),
            isHoliday: x.category === 'Holiday',
            isLeave: x.category === 'Leave',
            name: x.name,
          };

          allLeaves.push(item);
        }
        for (const x of allLeaves) {
          if (
            x.month === initialValue.month() &&
            x.year === initialValue.year()
          ) {
            daysToHighlight.push(x);
          }
        }

        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      });
  }, [empId, initialValue]);

  const fetchHighlightedDays = (date: Dayjs): void => {
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

  const handleMonthChange = (date: Dayjs): void => {
    daysToHighlight = [];
    for (const x of allLeaves) {
      if (x.month === date.month() + 1 && x.year === date.year()) {
        daysToHighlight.push(x);
      }
    }

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
}

function WeeklyCalendar(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const theme = useTheme();
  const [currentWeekDates, setCurrentWeekDates] = useState<
    { date: Date; day: string }[]
  >(getCurrentWeekDates(new Date(), t));
  const [leaves, setLeaves] = useState<any>([]);

  const moveToPreviousWeek = (): void => {
    setCurrentWeekDates((prevWeekDates) => {
      const newStartDate = new Date(prevWeekDates[0].date);
      newStartDate.setDate(newStartDate.getDate() - 7);
      return getCurrentWeekDates(newStartDate, t);
    });
  };

  const moveToNextWeek = (): void => {
    setCurrentWeekDates((prevWeekDates) => {
      const newStartDate = new Date(prevWeekDates[0].date);
      newStartDate.setDate(newStartDate.getDate() + 7);
      return getCurrentWeekDates(newStartDate, t);
    });
  };

  const isCurrentDate = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  const empId = sessionStorage.getItem('empId_key');

  const getMyLeavesData = async (): Promise<void> => {
    jwtInterceptor
      .get(
        'api/PublicHoliday/GetAllLeavesAndPublicHolidays?EmployeeDetaailId=' +
        empId
      )
      .then((response: any) => {
        setLeaves(response.data);
        daysToHighlight = [];
        allLeaves = [];
        for (const x of response.data) {
          const item: any = {
            day: new Date(x.startDate).getDate(),
            month: new Date(x.startDate).getMonth(),
            year: new Date(x.startDate).getFullYear(),
            isHoliday: x.category === 'Holiday',
            isLeave: x.category === 'Leave',
            name: x.name,
          };

          allLeaves.push(item);
        }
      });
  };

  const checkLeaveForDate = (date: any): any => {
    return leaves?.some((leave: any) => {
      const leaveDate = new Date(leave.startDate);
      return date.toDateString() === leaveDate.toDateString();
    });
  };

  const getBadgeColor = (date: Date): string | undefined => {
    const hasLeave = checkLeaveForDate(date);
    if (hasLeave) {
      const leave = leaves.find((leave: any) => {
        const leaveDate = new Date(leave.startDate);
        return date.toDateString() === leaveDate.toDateString();
      });
      return leave?.category === 'Leave' ? 'success' : 'error';
    }
    return undefined;
  };

  const getTooltipContent = (date: Date): string | undefined => {
    const leave = leaves.find((leave: any) => {
      const leaveDate = new Date(leave.startDate);
      return date.toDateString() === leaveDate.toDateString();
    });

    if (leave) {
      return `${leave.name} - ${leave.category}`;
    }
  };

  useEffect(() => {
    void getMyLeavesData();
  }, []);

  return (
    <Box
      sx={{
        // backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 3,
        width: '100%',
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={moveToPreviousWeek}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          {getMonthYearString(currentWeekDates[0].date, locale)}
        </Typography>
        <IconButton onClick={moveToNextWeek}>
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', padding: 5 }}
      >
        {currentWeekDates.map((day: any, index: any) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '5px',
              borderRadius: '20px',
              backgroundColor: isCurrentDate(day.date) ? '#132f60' : 'inherit',
              color: isCurrentDate(day.date) ? 'white' : 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: '500' }}>
              {getDayName(day.date.getDay(), t).charAt(0)}
            </div>
            <Box
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: isCurrentDate(day.date)
                  ? theme.palette.primary.main
                  : // : theme.palette.background.paper,
                  '',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 12,
                fontWeight: '500',
                color: isCurrentDate(day.date)
                  ? theme.palette.text.primary
                  : theme.palette.text.primary,
              }}
            >
              <Tooltip title={getTooltipContent(day.date)} placement='top'>
                <Badge
                  badgeContent=' '
                  // color={`${getBadgeColor(day.date)}`}
                  color='success'
                  variant='dot'
                  invisible={!checkLeaveForDate(day.date)}
                >
                  {day.date.getDate()}
                </Badge>
              </Tooltip>
            </Box>
          </div>
        ))}
      </div>
    </Box>
  );
}

export default WeeklyCalendar;
