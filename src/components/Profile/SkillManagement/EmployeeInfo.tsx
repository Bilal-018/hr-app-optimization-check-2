import { Box, Drawer, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularIcon from '../../Global/CircularIcon';
import CloseIcon from '@mui/icons-material/Close';
import EnhancedTable from '../../Global/Table';
import { CircularChip, RoundedChip } from '../../Global/Chips';
import { useTranslation } from 'react-i18next';
import jwtInterceoptor from '../../../services/interceptors';

const employee_data = {
  employeeName: '',
  designation: '',
  department: '',
  skillByEmployeedetailIds: [],
};

const dummyImg =
  'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg';

const head = [
  {
    id: 'skill',
    label: 'Skill',
  },
  {
    id: 'achieved',
    label: 'Achieved',
  },
  {
    id: 'required',
    label: 'Required',
  },
  {
    id: 'expertise',
    label: 'Expertise',
  },
];

const createData = (
  skill: any,
  achieved: any,
  required: any,
  expertise: any
) => {
  return {
    skill,
    achieved: <CircularChip value={achieved} color='#18A0FB' />,
    required: <CircularChip value={required} color='#18A0FB' />,
    expertise: (
      <RoundedChip
        status={String(expertise.name)[0].toUpperCase() + String(expertise.name).substring(1)}
        agendaColor={expertise.color}
        employee={true}
      />
    ),
  };
};

function EmployeeInfo({ open, setOpen, id }: any) {
  const [skills, setSkills] = useState<any>([]);
  const [pictureBase64, setPictureBase64] = useState<string>('');

  const [userInfo, setUserInfo] = useState<any>({
    ...employee_data,
  });
  const { t } = useTranslation();
  const email = sessionStorage.getItem('email_key');

  const GetInfo: any = (id: any) => {
    jwtInterceoptor
      .get(
        'api/SkillManager/GetSkillByEmployeeDetailId?EmployeeDetailId=' +
        id +
        '&email=' +
        email
      )
      .then((response: any) => {
        const uniqueSkills = response.data.skillByEmployeedetailIds.reduce(
          (acc: any, cur: any) => {
            if (!acc.find((x: any) => x.name === cur.expertise.toLowerCase())) {
              acc.push({
                name: cur.expertise.toLowerCase(),
                color: cur.agendaColor,
              });
            }
            return acc;
          },
          []
        );

        setSkills(uniqueSkills);

        setUserInfo(response.data);
      })
      .catch((err: any) => { console.log("error is: ", err) });
  };

  let pictureURI =
    process.env.REACT_APP_API_PROFILE_SERVICE_URL +
    '/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
    id +
    '&email=' +
    email;

  const convertImageToBase64 = async () => {
    try {
      const response = await fetch(pictureURI);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPictureBase64(base64String);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      GetInfo(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if(pictureURI){
      void convertImageToBase64();
    }
  }, [pictureURI]);

  if (!userInfo) return null;

  // const rows = [
  //   createData("React", 4, 8, skills[0]),
  //   createData("Javascript", 8, 6, skills[1]),
  // ];

  const getRows = () =>
    userInfo.skillByEmployeedetailIds.map((x: any) => {
      const expertise =
        skills[
        skills.findIndex((y: any) => y?.name === x.expertise?.toLowerCase())
        ];

      return createData(
        x?.skill,
        x?.achievedScore,
        x?.requiredScore,
        expertise || skills[0]
      );
    });

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          background: 'transparent',
          justifyContent: 'end',
          boxShadow: 'none',
          px: 2,

          '@media (max-width: 600px)': {
            width: '100%',
            px: 0,
          },
        },
      }}
      sx={{
        // backdrop
        '& .MuiBackdrop-root': {
          background: 'transparent',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          minWidth: '400px',
          padding: '20px',
          height: '90%',
          overflow: 'auto',
          zIndex: '1000',
          background: (theme) => theme.palette.background.paper,
          borderRadius: '20px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',

          '@media (max-width: 600px)': {
            minWidth: '100%',
            borderRadius: '0px',
            height: '100%',
          },
        }}
      >
        <CircularIcon
          icon={<CloseIcon />}
          color='#092C4C'
          onClick={() => setOpen(false)}
          sx={{
            width: '30px',
            height: '30px',
            marginLeft: 'auto',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            img: {
              border: '2px solid #FFF',
              borderRadius: '50%',
              aspectRatio: '1/1',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
              width: '150px',
              height: '150px',
              objectFit: 'cover',
            },
          }}
        >
          <img
            src={pictureBase64 ? pictureBase64 : dummyImg}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = dummyImg;
            }}
            alt='employee'
          />
          <Typography className='LargeBody'>
            {t(userInfo?.employeeName)}
          </Typography>
          {userInfo.designation && (
            <Typography className='smallBody' fontWeight={400}>
              {t(userInfo?.designation)}
            </Typography>
          )}
          <Typography
            className='smallBody'
            fontWeight={400}
            sx={{ fontStyle: 'italic' }}
          >
            {t(userInfo?.department)}
          </Typography>
        </Box>
        {/* <Stack
          justifyContent='space-around'
          alignItems='center'
          direction='row'
          sx={{
            my: '20px',
            pt: '20px',
            borderTop: `.5px solid ${alpha('#092C4C', 0.1)}`,
          }}
        >
          {skills.map((skill: any) => (
            <Stack direction='row' alignItems='center' gap='10px'>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: skill?.color,
                }}
              ></Box>
              <Typography
                className='smallBody'
                sx={{
                  textTransform: 'capitalize',
                }}
              >
                {t(skill?.name)}
              </Typography>
            </Stack>
          ))}
        </Stack> */}
        <Typography
          variant='h6'
          sx={{
            marginBottom: '10px',
          }}
        >
          {t('Skills')}
        </Typography>

        <EnhancedTable
          head={head}
          rows={getRows()}
          hidePagination
          sx={{
            minWidth: '100%',
          }}
        />
      </Box>
    </Drawer>
  );
}

export default EmployeeInfo;
