import {
  HRDashboardIcon,
  HomeIcon,
  MyPortalIcon,
  RecruitmentIcon,
  TimeAndAttendanceIcon,
} from '../assets/images';

export const MENU_FULL_OPTIONS = [
  {
    id: 1,
    name: 'Home',
    icon: HomeIcon,
    route: '/dashboard',
    subOptions: [],
    role: 'Employee',
    isFavorite: false,
  },
  {
    id: 2,
    name: 'My Portal',
    icon: MyPortalIcon,
    route: null,
    isFavorite: false,
    subOptions: [
      {
        id: 1,
        name: 'My Profile',
        route: '/my-profile',
        isFavorite: false,
      },
      {
        id: 2,
        name: 'Skill Management',
        route: '/skill-management',
        isFavorite: false,
      },
      {
        id: 3,
        name: 'Leave Management',
        route: '/leave-management',
        isFavorite: false,
      },
    ],
    role: 'Employee',
  },
  {
    id: 3,
    name: 'Time and Attendance',
    icon: TimeAndAttendanceIcon,
    route: '',
    subOptions: [],
    role: 'Employee',
    isFavorite: false,
    disable: true,
  },
  {
    id: 4,
    name: 'Resource Planning',
    icon: RecruitmentIcon,
    route: '',
    subOptions: [],
    role: 'Employee',
    isFavorite: false,
    disable: true,
  },
  {
    id: 5,
    name: 'HR Manager',
    icon: HRDashboardIcon,
    route: '/hr-dashboard',
    subOptions: [],
    role: 'Admin',
    isFavorite: false,
  },
];

/* {
    id: 3,
    name: "Organisation Chart",
    icon: ChartIcon,
    route: "/organization-chart",
    subOptions: [],
    isFavorite: false,

    role: "Employee",
  },
  {
    id: 4,
    name: "Recruitment",
    icon: RecruitmentIcon,
    isFavorite: false,

    subOptions: [
      {
        id: 1,
        name: "Job Vacancies",
        isFavorite: true,
        route: "/job-vacancies",
      },
      {
        id: 2,
        name: "Candidates",
        isFavorite: false,
        route: "/candidates",
      },
      {
        id: 3,
        name: "Onboarding",
        isFavorite: false,
        route: "/onboarding",
      },
      {
        id: 4,
        name: "Off Boarding",
        isFavorite: false,
        route: "/off-boarding",
      },
    ],
    role: "Employee",
  },
  {
    id: 5,
    name: "Talent Management",
    icon: TalentManagementIcon,
    isFavorite: false,

    subOptions: [
      {
        id: 1,
        name: "Job Vacancies",
        isFavorite: true,
        route: "/job-vacancies",
      },
      {
        id: 2,
        name: "Candidates",
        isFavorite: false,
        route: "/candidates",
      },
      {
        id: 3,
        name: "Onboarding",
        isFavorite: false,
        route: "/onboarding",
      },
      {
        id: 4,
        name: "Off Boarding",
        isFavorite: false,
        route: "/off-boarding",
      },
    ],
    role: "Employee",
  },*/
export const MENU_NEW_USER = [];

export const LevelColor = {
  Expert: '#964CF5',
  Advanced: '#18A0FB',
  Basic: '#03B525',
  Trainee: '#C31091',
};

export const DistributionColor = {
  Chercheur: '#964CF5',
  Professeur: '#18A0FB',
  Apprenti: '#03B525',
  sTRAGIERE: '#C31091',
};

export const LeaveTypes = [
  'Annual Leave',
  'Bereavement leave',
  'Casual leave',
  'Compensatory off',
  'Sick leave',
];
