import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import Link from '../Link/Link';
import { useTranslation } from 'react-i18next';

function TermsAndCondition() {
  const { t } = useTranslation();
  return (
    <Box
      sx={(theme) => ({
        mx: 'auto',
        padding: { xs: '22px', sm: '55px' },
        background: theme.palette.background.default,
        borderRadius: '10px',
        width: '100%',
        maxWidth: { xs: '95%', sm: '800px' },
        height: { xs: '88vh', sm: '80vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      })}
    >
      <Typography
        variant='h2'
        fontWeight={600}
        textAlign='center'
        sx={{
          fontSize: { xs: '28px', sm: '48px' },
        }}
      >
        {t('Terms and Conditions')}
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 10px',
          border: '1px solid rgba(9, 44, 76, 0.1)',
          borderRadius: '20px',
          maxHeight: 'fit-content',
          my: { xs: '10px', sm: '30px' },
        }}
      >
        <Typography
          className='smallBody'
          sx={{
            textAlign: 'start',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. At
          suspendisse mauris ut pulvinar. Cursus arcu senectus cras sit vel
          enim, etiam mattis. Sed risus, nulla dapibus in. Dolor habitant ipsum
          odio erat parturient sit eleifend est. Ipsum eros, aliquet odio
          parturient. Et donec egestas congue ornare commodo. Odio ac, Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. At suspendisse
          mauris ut pulvinar. Cursus arcu senectus cras sit vel enim, etiam
          mattis. Sed risus, nulla dapibus in. Dolor habitant ipsum odio erat
          parturient sit eleifend est. Ipsum eros, aliquet odio parturient. Et
          donec egestas congue ornare commodo. Odio ac,Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. At suspendisse mauris ut pulvinar.
          Cursus arcu senectus cras sit vel enim, etiam mattis. Sed risus, nulla
          dapibus in. Dolor habitant ipsum odio erat parturient sit eleifend
          est. Ipsum eros, aliquet odio parturient. Et donec egestas congue
          ornare commodo. Odio ac,Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. At suspendisse mauris ut pulvinar. Cursus arcu
          senectus cras sit vel enim, etiam mattis. Sed risus, nulla dapibus in.
          Dolor habitant ipsum odio erat parturient sit eleifend est. Ipsum
          eros, aliquet odio parturient. Et donec egestas congue ornare commodo.
          Odio ac,Lorem ipsum dolor sit amet, consectetur adipiscing elit. At
          suspendisse mauris ut pulvinar. Cursus arcu senectus cras sit vel
          enim, etiam mattis. Sed risus, nulla dapibus in. Dolor habitant ipsum
          odio erat parturient sit eleifend est. Ipsum eros, aliquet odio
          parturient. Et donec egestas congue ornare commodo. Odio ac,
          <br />
          <br />
          <br />
          Cursus arcu senectus cras sit vel enim, etiam mattis. Sed risus, nulla
          dapibus in. Dolor habitant ipsum odio erat parturient sit eleifend
          est. Ipsum eros, aliquet odio parturient. Et donec egestas congue
          ornare commodo. Odio ac,Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. At suspendisse mauris ut pulvinar. Cursus arcu
          senectus cras sit vel enim, etiam mattis. Sed risus, nulla dapibus in.
          Dolor habitant ipsum odio erat parturient sit eleifend est. Ipsum
          eros, aliquet odio parturient. Et donec egestas congue ornare commodo.
          Odio ac,
        </Typography>
      </Box>
      <Link to='/'>
        <Button variant='contained' sx={{ fontSize: '20px', width: '80%' }}>
          {t('Acknowledge')}
        </Button>
      </Link>
    </Box>
  );
}

export default TermsAndCondition;
