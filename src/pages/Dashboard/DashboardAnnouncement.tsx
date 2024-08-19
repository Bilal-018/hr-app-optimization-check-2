import React, { useEffect, useState, useRef } from 'react';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Icon } from '@iconify/react';
import TextIcon from '../../components/Icon/TextIcon';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../components/Global/WithSnackbar';
import jwtInterceptor from '../../services/interceptors';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper';
import AnnouncementPopup from '../../components/ModalPopUp/AnnouncementPopUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material';

function DashboardAnnouncement() {
  const { t } = useTranslation();
  const userTheme = useTheme();
  const initialized = useRef(false);
  const { showMessage }: any = useSnackbar();
  const [announcement, setannouncement] = useState<any>([]);
  const bearerToken = sessionStorage.getItem('token_key');
  const [currentSlide, setCurrentSlide] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setModalOpen] = useState(false);
  const [announcementDet, setannouncementDet] = useState<any>(null);
  const [open, setOpen] = useState<any>({
    open: false,
  });

  const openModal = () => {
    setannouncementDet(announcement[currentSlide]);
    setOpen({
      open: true,
    });
  };
  const base_url = process.env.REACT_APP_BASE_URL;

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  const getAnnouncementData = () => {
    jwtInterceptor
      .get('api/Anouncement/GetActiveAnnouncement')
      .then((response: any) => {
        let objAnnouncements = [];

        for (let i in response.data) {
          const formattedDate = new Date(
            response.data[i].startDate
          ).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          objAnnouncements.push({
            title: response.data[i].title,
            description: response.data[i].description,
            startDate: formattedDate,
          });
        }
        setannouncement(objAnnouncements);
      })
      .catch((error: any) => {
        showMessage(error.message, 'error');
      });
  };
  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        getAnnouncementData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matches = useMediaQuery(userTheme.breakpoints.up('md'));

  function truncateDescription(description: any, maxLength: any) {
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  }

  return (
    <div style={{ flex: 1, display: 'flex', backgroundColor: userTheme.palette.mode === 'dark' ? '' : 'white', padding: matches ? '20px' : '0px', borderRadius: '12px' }}>
      <Box width='100%' minHeight={{ xs: 'auto', md: '250px' }} maxWidth={{ xs: '270px', sm: '100%' }} my={{ xs: 3, md: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px',
          }}
        >
          <Typography variant='h6' sx={{ display: { xs: 'none', md: 'block' } }} fontWeight={600}>
            {t('Announcements')}
          </Typography>

          <Typography fontSize={14} sx={{ display: { xs: 'block', md: 'none' } }} fontWeight={600}>
            {t('Announcements')}
          </Typography>

          <div>
            <button
              className='arrow-right arrow'
              style={{
                border: 0,
                background: 'transparent',
                padding: '0',
                color:
                  currentSlide === 0
                    ? 'grey'
                    : userTheme.palette.mode === 'light'
                      ? 'blue'
                      : 'white',
              }}
            >
              <KeyboardArrowLeftIcon />
            </button>

            <button
              className='arrow-left arrow'
              style={{
                border: 0,
                background: 'transparent',
                color:
                  currentSlide === announcement.length - 1
                    ? 'grey'
                    : userTheme.palette.mode === 'light'
                      ? 'blue'
                      : 'white',
                padding: '0',
              }}
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>
        </div>

        <div>
          <Swiper
            grabCursor={true}
            // centeredSlides={true}
            slidesPerView={'auto'}
            navigation={{ nextEl: '.arrow-left', prevEl: '.arrow-right' }}
            pagination={false}
            modules={[Pagination, Navigation]}
            className='mySwiper'
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.realIndex);
            }}
          >
            {announcement.length > 0 &&
              announcement.map((item: any, index: any) => (
                <SwiperSlide
                  key={index}
                  style={
                    {
                      // backgroundColor: theme.palette.background.backLessOps,
                    }
                  }
                >
                  <div style={{ display: 'block', width: '100%', padding: 16 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <TextIcon
                        icon='ph:chats-circle-fill'
                        color='#E2B93B'
                        size={40}
                        fontSize={22}
                      />
                      <Typography fontWeight={500} fontSize={14}>
                        {item.title}
                      </Typography>
                    </div>

                    <div>
                      <Typography
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        variant='caption'
                        color={(theme) => theme.palette.action.disabled}
                      >
                        <b>Posted:</b> &nbsp; <span>{item.startDate}</span>
                      </Typography>

                      <div>
                        <Typography
                          sx={{
                            lineHeight: 'normal',
                            fontSize: '14px',
                            textAlign: 'left',
                            display: { xs: 'none', md: 'block' }
                          }}
                        // mr={"auto"}
                        >
                          {truncateDescription(item.description, 50)}
                        </Typography>
                        <Typography
                          sx={{
                            lineHeight: 'normal',
                            fontSize: '12px',
                            textAlign: 'left',
                            display: { xs: 'block', md: 'none' }
                          }}
                        // mr={"auto"}
                        >
                          {truncateDescription(item.description, 50)}
                        </Typography>

                        <Button
                          endIcon={<Icon icon='formkit:arrowright' />}
                          sx={{
                            svg: { fontSize: '12px !important' },
                            fontSize: '10px !important',
                            display: 'flex',
                            padding: 0,
                          }}
                          variant='text'
                          onClick={openModal}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <AnnouncementPopup
          open={open.open}
          handleClose={() => {
            setOpen({
              open: false,
              id: null,
            });
          }}
          announcementData={announcementDet}
        />
      </Box>
    </div>
  );
}
export default DashboardAnnouncement;
