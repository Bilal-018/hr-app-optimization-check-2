import { Box, Popover, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  ExpandMoreIcon,
  LogoutIcon,
  SettingIcon,
  SupportIcon,
  ThemeIcon,
  UserPlaceholder,
} from '../../../../assets/images';
import UserOption from './UserOption';
import { themeTypes } from '../../../../theme';
import jwtInterceoptor from '../../../../services/interceptors'

interface UserImageProps {
  userPicture: string;
}

const USER_OPTIONS = [
  {
    id: 1,
    name: 'Theme',
    icon: ThemeIcon,
    options: ['Default', 'Atlantic', 'Tokyo'],
  },
  {
    id: 2,
    name: 'Settings',
    icon: SettingIcon,
    options: [],
  },
  {
    id: 3,
    name: 'Support',
    icon: SupportIcon,
    options: [],
  },
  {
    id: 4,
    name: 'Logout',
    icon: LogoutIcon,
    options: [],
  },
];

export const UserImage: React.FC<UserImageProps> = ({ userPicture }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    const convertImageToBase64 = async () => {
      if (typeof userPicture === 'string') {
        try {
          const response = await fetch(userPicture);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setBase64Image(base64String);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error(error);
        }
      } else {
        setBase64Image('');
      }
    };
    void convertImageToBase64();
  }, [userPicture]);

  return (
    <img
      src={base64Image ? base64Image : userPicture}
      alt='logo'
      style={{
        width: matches ? '40px' : '36px',
        borderRadius: '50%',
        border: '1px solid #092C4C',
        aspectRatio: '1/1',
        objectFit: 'cover',
      }}
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = UserPlaceholder;
      }}
    />
  );
};

function UserInfo(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userName = sessionStorage.getItem('fullname') ?? '';
  const empId = sessionStorage.getItem('empId_key') ?? '';
  const email = sessionStorage.getItem('email_key') ?? '';
  const [userPicture, setUserPicture] = useState('');

  const bearerToken = sessionStorage.getItem('token_key');

  const getProfilePicture = async () => {
    try {
      const response = await jwtInterceoptor.get(
        'api/Employee/GetProfilePictureFileStream',
        {
          params: {
            EmployeeDetailId: empId,
            email: email,
          },
          responseType: 'arraybuffer',
        }
      );

      const uint8Array = new Uint8Array(response.data);
      let binaryString = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64String = btoa(binaryString);
      setUserPicture(`data:image/jpeg;base64,${base64String}`);
    } catch (error) {
      setUserPicture(UserPlaceholder);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    if (bearerToken) {
      void getProfilePicture();
    }
  }, []);

  const base_url = process.env.REACT_APP_BASE_URL;

  const onLogout = async () => {
    try {
      const response = await jwtInterceoptor.post('api/Authenticate/Logout');
      if (response.data.statusCode === 200) {
        sessionStorage.clear();
        window.location.href = base_url + '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
    // sx={{
    //   mt: isTablet ? 'auto' : '0px',
    // }}
    >
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        onClick={handleClick}
      >
        <UserImage userPicture={userPicture} />
        <Typography sx={{ fontSize: '14px', fontWeight: '500', lineHeight: '17px' }} display={{ xs: 'none', md: 'block' }}>{userName}</Typography>
        <ExpandMoreIcon sx={{ width: '15px' }} />
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: '177px',
            maxHeight: '270px',
            padding: '10px 10px 10px 20px',
            borderRadius: '12px',
            // hide scrollbar
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        }}
      >
        {/* <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          sx={{
            borderBottom: '.5px solid #092C4C',
            pb: '10px',
            mb: '5px',
          }}
        >
          <UserImage userPicture={userPicture} />
          <Typography className='smallBody'>{userName}</Typography>
        </Stack> */}
        <UserOption
          icon={USER_OPTIONS[0].icon}
          name={USER_OPTIONS[0].name}
          options={Object.keys(themeTypes)}
        />
        <UserOption
          icon={USER_OPTIONS[2].icon}
          name={USER_OPTIONS[2].name}
          options={USER_OPTIONS[2].options}
        />
        <UserOption
          icon={USER_OPTIONS[3].icon}
          name={USER_OPTIONS[3].name}
          options={USER_OPTIONS[3].options}
          onClick={() => void onLogout()}
        />
      </Popover>
    </Box>
  );
}

export default UserInfo;
