import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import GetImage from './GetImage';
import { useTranslation } from 'react-i18next';

function Card({ data, selectPresentation, selected }: any) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      direction='row'
      sx={{
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        // width: "400px",
        width: '100%',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },

        '&:hover': {
          backgroundColor: (theme) => theme.palette.background.paper,
        },
      }}
      onClick={() => selectPresentation(data.id)}
    >
      <Stack
        direction='row'
        spacing={2}
        sx={{
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          },
        }}
      >
        <Box
          sx={{
            width: '180px',
            height: '100px',
            overflow: 'hidden',

            [theme.breakpoints.down('sm')]: {
              width: '80%',
            },
            // border: (theme) => `1px solid ${theme.palette.common.black}`,
          }}
        >
          <GetImage
            presentation={data.presentations[0]}
            styles={{
              width: '90%',
              height: '90%',
              objectFit: 'cover',
              border: data?.id === selected ? '5px solid #18A0FB' : '',
            }}
          />
        </Box>
        <Stack
          direction='column'
          justifyContent='space-around'
          alignItems='flex-start'
        >
          <Typography
            variant='h5'
            sx={{ fontSize: 24, fontWeight: 'bold', color: '#18A0FB' }}
          >
            {data.title}
          </Typography>
          <Typography
            className='smallBody'
            sx={{
              color: '#828282',
            }}
          >
            <strong>{t('Posted')}:</strong> {data.posted}
          </Typography>

          <Typography
            className='smallBody'
            sx={{
              color: '#828282',
            }}
          >
            <strong>{t('Format')}:</strong> {data.format}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function CardsSlide({
  presentations = [],
  selectPresentation,
  activePage,
  selected,
}: any) {
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const swiperRef = useRef<any>(null);
  const updateIndex = (swiperInstance: any) => {
    if (swiperInstance === null) return;

    // const currentSlide = swiperInstance?.activeIndex;
    // setActivePage(currentSlide + 1);
  };

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo((activePage - 1) * 3);
    }
  }, [activePage]);

  return (
    <Box
      sx={{
        my: 4,
        '.swiper': {
          borderRadius: '0px',
        },
        '.swiper-slide': {
          height: 'fit-content',
        },
        width: '100%',
      }}
    >
      <Swiper
        ref={swiperRef}
        navigation={false}
        modules={[Navigation]}
        className='mySwiper'
        slidesPerView={isTablet ? 1 : 3}
        spaceBetween={0}
        initialSlide={activePage}
        onActiveIndexChange={updateIndex}
        slidesPerGroup={isTablet ? 1 : 3}
      >
        {presentations.length > 0 &&
          presentations.map((item: any, index: any) => (
            <SwiperSlide
              key={index}
              style={{
                background: 'transparent',
              }}
            >
              <Card
                data={item}
                selectPresentation={selectPresentation}
                selected={selected}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );
}
