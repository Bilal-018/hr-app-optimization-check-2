import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import { Box } from '@mui/material';
import GetImage from './GetImage';
import BaseModal from '../Global/Modal';

export default function MainSlider({ slides }: any) {
  console.log(slides);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        // maxWidth: "700px",
        width: '100%',
        height: '100%',
        '.swiper': {
          width: 'auto',
          height: '567px',
          background: '#fff',
          borderRadius: '0px',
          '.swiper-wrapper': {
            alignItems: 'center',
          },
          // border: (theme) => `1px solid ${theme.palette.common.black}`,
        },

        '.swiper-slide': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          img: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          },
          color: '#092C4C',
          svg: {
            width: '150px',
            height: '150px',
            fill: '#092C4C',
          },
        },
      }}
    >
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        navigation={true}
        modules={[Navigation]}
        className='mySwiper'
      >
        {slides?.length > 0 &&
          slides?.map((item: any, index: any) => {
            return (
              <SwiperSlide key={index} onClick={handleImageClick}>
                <GetImage presentation={item} />
              </SwiperSlide>
            );
          })}
      </Swiper>

      <BaseModal
        title='Presentation - Preview'
        open={isModalOpen}
        showSaveButton={false}
        handleClose={() => { setIsModalOpen(false) }}>
        <Box
          sx={{
            // maxWidth: "700px",
            width: '100%',
            height: '100%',
            '.swiper': {
              width: 'auto',
              height: '100%',
              background: '#fff',
              borderRadius: '0px',
              '.swiper-wrapper': {
                alignItems: 'center',
              },
              // border: (theme) => `1px solid ${theme.palette.common.black}`,
            },

            '.swiper-slide': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              img: {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
              color: '#092C4C',
              svg: {
                width: '150px',
                height: '150px',
                fill: '#092C4C',
              },
            },
          }}
        >
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
          >
            {slides?.length > 0 &&
              slides?.map((item: any) => {
                return (
                  <SwiperSlide>
                    <GetImage presentation={item} isModalOpen={isModalOpen} />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </Box>
      </BaseModal>
    </Box>
  );
}
