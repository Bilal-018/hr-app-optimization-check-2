import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import EditAndSave from '../Global/EditAndSave';
import EditFieldsModal from '../Global/EditFieldsModal';
import { useTranslation } from 'react-i18next';
import { } from 'rsuite';

const InfoCards = ({
  values,
  onSave,
  title,
  loading,
  twoTier = false,
  title2,
  addAndDelete = true,
  saveOnTop = false,
  mainTitle = '',
  numberLimit = 0,
}: any) => {
  const [open, setOpen] = useState<any>(false);

  const { t } = useTranslation();

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <Box
      // className='section-border'
      sx={() => ({
        // border: `1px solid ${theme.palette.common.black}`,
      })}
    >
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='space-between'
        mb={1}
        pb={1}
      >
        {title2 && (
          <Typography fontSize={14} color={'#092C4C'} sx={{ opacity: '0.7' }}>
            {title2}
          </Typography>
        )}
        <Typography fontSize={14} color={'#092C4C'} sx={{ opacity: '0.7' }}>
          {title}
        </Typography>
        {saveOnTop && (
          <EditAndSave
            showConfirm={false}
            setEdit={() => {
              setOpen(true);
            }}
          />
        )}
      </Stack>

      {/* {saveOnTop && (
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          justifyContent='space-between'
          sx={{
            borderBottom: '1px solid #E5E5E5',
          }}
          mb={1}
          pb={1}
        >
          {mainTitle && <span>{t(mainTitle)}</span>}
          {saveOnTop && (
            <EditAndSave
              showConfirm={false}
              setEdit={() => {
                setOpen(true);
              }}
            />
          )}
        </Stack>
      )} */}
      {/* <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='space-between'
        sx={{
          borderBottom: '1px solid #E5E5E5',
        }}
        mb={1}
        pb={1}
      >
        {twoTier && <span>{t(title2)}</span>}
        <span>{t(title)}</span>
        {!saveOnTop && (
          <EditAndSave
            showConfirm={false}
            setEdit={() => {
              setOpen(true);
            }}
          />
        )}
      </Stack> */}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack
          direction='column'
          spacing={2}
          sx={{
            mr: twoTier && !saveOnTop ? 15 : '0px',
          }}
        >
          {values.map((value: any) => {
            return (
              <Stack
                direction={twoTier ? 'row' : 'column'}
                spacing={2}
                sx={{
                  borderBottom: '1px solid #E5E5E5',
                  paddingBottom: '10px',
                  columnGap: twoTier && {xl:'20%', lg:'8%', md:'23%', sm:'25%'}
                }}
              >
                {twoTier && (
                  <Typography
                    key={value.id}
                    my={2}
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                      width: '132px'
                    }}
                  >
                    {t(value.title)}
                  </Typography>
                )}
                <Typography
                  key={value.id}
                  my={2}
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  {t(value.value)}
                </Typography>
              </Stack>
            );
          })}
          {!values && loading && (
            <Typography
              my={2}
              sx={{
                fontSize: '14px',
                fontWeight: '500',
                borderBottom: '1px solid #E5E5E5',
                paddingBottom: '20px',
              }}
            >
              {t('Loading')}...
            </Typography>
          )}
        </Stack>
      )}

      <EditFieldsModal
        fields={values}
        open={open}
        handleClose={toggleModal}
        onSave={onSave}
        title={`Update ${mainTitle || title}`}
        twoTier={twoTier}
        addAndDelete={addAndDelete}
        isKeyValue={saveOnTop && twoTier}
        numberLimit={numberLimit}
      />
    </Box>
  );
};

export default InfoCards;
