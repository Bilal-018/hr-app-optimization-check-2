import { Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import CompanySlides from './CompanySlides';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../Global/WithSnackbar';
import jwtInterceptor from '../../services/interceptors';
import { Link } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';

interface Presentation {
  id: number;
  description: string;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

function CompanyPresentation(): JSX.Element {
  const { t } = useTranslation();
  const [presentation, setPresentation] = useState<Presentation[]>([]);
  const initialized = useRef(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;
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
  }, []);

  const getCompanyPresentationData = async () => {
    try {
      // eslint-disable-next-line
      const response: AxiosResponse<Presentation[]> = await jwtInterceptor.get(
        'api/PresentationDetail/GetDetailsForPresentationPage'
      );
      setPresentation(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data as { Message: string };
        showMessage(errorMessage.Message, 'error');
      } else if (error instanceof Error) {
        showMessage(error.message, 'error');
      } else {
        showMessage('An unknown error occurred', 'error');
      }
    }
  };

  return (
    <Grid
      container
      spacing={1}
      sx={() => ({
        padding: '20px',
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
