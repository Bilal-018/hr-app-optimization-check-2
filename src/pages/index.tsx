import { Box, Button, IconButton, Typography, alpha } from '@mui/material';
import React, { useState } from 'react';
import {
  BDImg,
  BackgroundLandingPage,
  CRMImg,
  HRImg,
  QHSEImg,
  RecommendationImg,
  Slide1,
} from '../assets/images';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './index.css';
import { Navigation, Pagination } from 'swiper';
import { FacebookOutlined, Instagram, LinkedIn } from '@mui/icons-material';

import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const Slide = ({ name }: any) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: `url(${Slide1})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    >
      <Typography
        variant='h3'
        fontWeight={700}
        sx={{
          ml: '10%',
          mt: '40px',
        }}
      >
        {t('Hi')}, {name}
      </Typography>
      <Typography
        className='body'
        sx={{
          ml: '10%',
        }}
      >
        {t('Welcome on Slaeb’s environment')}
      </Typography>
      {/* <Button
        sx={{
          ml: "10%",
          mt: "40px",
          fontSize: "16px",
          width: "fit-content",
          maxWidth: "80%",

          [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
            mt: "20px",
          },
        }}
        variant="contained"
      >
        {t("Let’s start our first steps together")}
      </Button> */}
    </Box>
  );
};

const CommunityCard = ({ name, productImg, members }: any) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        py: 1,
        px: 2,
        border: '1px solid rgba(9, 44, 76, 0.05)',
        borderRadius: '20px',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 0.7,
        }}
      >
        <img
          src={productImg}
          alt='community'
          width='70px'
          height='70px'
          style={{
            objectFit: 'cover',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '70px',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: 2,
          }}
        >
          <Typography className='smallBodyBold'>{t(name)}</Typography>
          <Typography className='smallBody'>{t(members)}</Typography>
        </Box>
      </div>
      <IconButton
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: alpha('#B3B3BF', 0.2),
          borderRadius: '50%',
          cursor: 'not-allowed',
          pointerEvents: 'none',

          svg: {
            fill: '#B3B3BF',
            width: '20px',
            height: '20px',
          },
        }}
        size='small'
      >
        <QuestionAnswerIcon />
      </IconButton>
    </Box>
  );
};

const ProductCard = ({
  name,
  productImg,
  route,
  underdevelopment,
}: any) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: '320px',
        width: '250px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '220px',
          height: '100%',
          p: 1,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',

          background: '#cccccc71',
          boxShadow: '0px 4px 34px rgba(9, 44, 76, 0.16)',
          borderRadius: '20px',
        }}
      >
        <Typography className='mediumBodyBold'>{t(name)}</Typography>
        <img
          src={productImg}
          alt='HR'
          style={{
            position: 'absolute',
            top: '47px',
            right: 0,
          }}
        />
        <Link to={route}>
          <Button
            variant='contained'
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              width: '90%',
            }}
            disabled={underdevelopment}
          >
            {underdevelopment ? t('Coming Soon') : t('Start')}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Human Resource',
    productImg: HRImg,
    route: '/dashboard',
    underdevelopment: false,
    members: 500,
  },
  {
    id: 2,
    name: 'QHSE',
    productImg: QHSEImg,
    route: '/',
    underdevelopment: true,
    members: 200,
  },
  {
    id: 3,
    name: 'Business Development',
    productImg: BDImg,
    route: '/',
    underdevelopment: true,
    members: 20,
  },
  {
    id: 4,
    name: 'CRM',
    productImg: CRMImg,
    route: '/',
    underdevelopment: true,
    members: 244,
  },
];

function Index() {
  const navigate = useNavigate();

  const fullName = sessionStorage.getItem('fullname');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, setName] = useState<any>(fullName);
  const bearerToken = sessionStorage.getItem('token_key');

  const { t } = useTranslation();
  console.log(bearerToken);
  if (bearerToken) {
    return (
      <Box
        sx={
          {
            // marginBottom: "90px",
          }
        }
      >
        <img
          src={BackgroundLandingPage}
          alt='background'
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderTopLeftRadius: '100px',
          }}
        />
        <Box
          sx={{
            mt: '-121px',
            // mx: "5%",
          }}
        >
          <Box
            sx={{
              height: '280px',
              display: 'flex',
              gap: '10px',
              mx: '5%',
            }}
          >
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className='mySwiper'
            >
              <SwiperSlide>
                <Slide name={name} />
              </SwiperSlide>
              <SwiperSlide>
                <Slide name={name} />
              </SwiperSlide>
              <SwiperSlide>
                <Slide name={name} />
              </SwiperSlide>
            </Swiper>
            <img
              src={RecommendationImg}
              alt='recommendation img'
              style={{
                width: '20%',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              mx: '5%',

              '@media only screen and (max-width: 800px)': {
                flexDirection: 'column',
              },
            }}
          >
            <Box>
              <Typography variant='h5'>{t('Our products')}</Typography>
              <Typography className='LargeBody' sx={{ opacity: 0.7 }}>
                {t('To help you build sustainable performance')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px',
                }}
              >
                {PRODUCTS.map((product) => (
                  <ProductCard {...product} key={product.id} />
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                width: {
                  md: '100%',
                  lg: '25%',
                },
              }}
            >
              <Typography variant='h5'>{t('Community')}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '30px',
                  flexDirection: 'column',
                }}
              >
                {PRODUCTS.map((product) => (
                  <CommunityCard {...product} key={product.id} />
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#132F60',
              color: '#FFF',
              // gap: "8px",
              p: 2,
              // position: "absolute",
              bottom: 0,
              left: 0,
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
                borderBottom: ' 1px solid #FFFFFF',
                width: '70%',

                a: {
                  width: 'fit-content',
                },

                svg: {
                  fill: '#fff',
                },
              }}
            >
              <a href='https://www.facebook.com/SlaebMQ/'>
                <FacebookOutlined />
              </a>
              <a href='https://www.linkedin.com/company/slaeb/'>
                <LinkedIn />
              </a>
              <a href='https://www.instagram.com/slaebmq/'>
                <Instagram />
              </a>
              <a href='https://twitter.com/slaebmq'>
                <img
                  src='https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png'
                  alt='twitter'
                  width='20px'
                  height='20px'
                  style={{
                    filter: 'invert(1)',
                  }}
                />
              </a>
              <a href='https://slaeb.com/'>
                <LanguageIcon />
              </a>
            </Box>
            <Typography className='body'>
              {t('Copyright © 2023. All Rights Reserved.')}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else {
    navigate('/');
  }
}

export default Index;
