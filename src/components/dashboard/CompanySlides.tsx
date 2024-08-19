import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper';
import './slides.css';

interface Slide {
  companyDetailId: number;
  fileName?: string;
}

// interface CompanySlidesProps {
//   slides: Slide[];
//   setSlide: React.Dispatch<React.SetStateAction<number>>;
// }

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;
const email = sessionStorage.getItem('email_key') ?? '';

export default function CompanySlides({ slides, setSlide }: any): JSX.Element {
  const getUrl = (item: Slide) => {
    return (
      API_URL +
      'api/PresentationDetail/OpenPresentationDetailFile/' +
      item.companyDetailId +
      '/' +
      (item.fileName?.split(',')[0] ?? '') +
      '?email=' +
      email
    );
  };

  const handleView = (item: Slide) => {
    let url =
      API_URL +
      'api/PresentationDetail/OpenPresentationDetailFile/' +
      item.companyDetailId +
      '/' +
      (item.fileName?.split(',')[0] ?? '') +
      '?email=' +
      email;
    window.open(url, '_blank');
  };

  return (
    <>
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        navigation={true}
        pagination={true}
        modules={[Pagination, Navigation]}
        className='mySwiper'
        onSlideChange={(swiper) => {
          setSlide(swiper.realIndex);
        }}
      >
        {slides.length > 0 &&
          slides
            .filter((item: any) => !!item?.fileName)
            .map((item: any, index: any) => (
              <SwiperSlide key={index}>
                <img
                  src={getUrl(item)}
                  alt={item.fileName || ''}
                  title={item.fileName || ''}
                  onClick={() => {
                    handleView(item);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </>
  );
}
