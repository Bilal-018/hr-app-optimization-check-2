import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import CompanySlides from './CompanySlides';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../Global/WithSnackbar';
import jwtInterceptor from '../../services/interceptors';
import { Link } from 'react-router-dom';

interface Presentation {
  id: number;
  description: string;
  // Add more fields if necessary
}

function CompanyPresentation(): JSX.Element {
  const { t } = useTranslation();
  const [presentation, setPresentation] = useState<Presentation[]>([]);
  const initialized = useRef(false);
  const { showMessage }: any = useSnackbar();
  const bearerToken = sessionStorage.getItem('token_key');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        void getCompanyPresentationData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCompanyPresentationData = async () => {
    try {
      const response = await jwtInterceptor.get(
        'api/PresentationDetail/GetDetailsForPresentationPage'
      );
      setPresentation(response.data);
    } catch (error: any) {
      showMessage(error.message, 'error');
    }
  };

  return (
    <Grid
      container
      spacing={1}
      sx={() => ({
        padding: '20px',
        // backgroundColor: theme.palette.background.paper,
        borderRadius: '20px',
      })}
    >
      <Grid item xs={12} md={6}>
        <Typography variant='h5' mb={2}>
          {t('Company Presentation')}
        </Typography>
        <Stack
          direction='column'
          justifyContent='space-between'
          gap={1}
          sx={{
            height: '80%',
          }}
        >
          {presentation.length > 0 && (
            <Typography variant='body2' sx={{ lineHeight: 'normal' }} mt={2}>
              {presentation[currentSlide].description}
            </Typography>
          )}
          <Link to='/presentations' style={{ color: 'white', width: '90%' }}>
            <Button
              variant='contained'
              sx={{
                fontSize: '14px',
                m: 0,
                px: '30px',
                mt: 1,
                width: '100%',
                mb: 2,
              }}
            >
              {t('More Details')}
            </Button>
          </Link>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          boxShadow: '0px 4px 8px 0px rgba(9, 44, 76, 0.10)',
        }}
      >
        <CompanySlides slides={presentation} setSlide={setCurrentSlide} />
      </Grid>
    </Grid>
  );
}

export default CompanyPresentation;
