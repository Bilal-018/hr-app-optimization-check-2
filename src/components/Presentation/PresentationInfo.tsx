import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { UserImage } from '../Navigation/Topbar/UserInfo/UserInfo';
import EditAndSave from '../Global/EditAndSave';
import { useTranslation } from 'react-i18next';

function PresentationInfo({
  onEditClick,
  selected,
  isManagerOrAdmin,
}: any) {
  const { t } = useTranslation();

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography
          variant='h5'
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          {selected.title}
        </Typography>
        <EditAndSave
          showConfirm={false}
          edit={false}
          setEdit={onEditClick}
          isManagerOrAdmin={isManagerOrAdmin}
        />
      </Stack>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        py={4}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.common.black}`,
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <UserImage userPicture={selected?.user?.img} />
          <Typography className='smallBodyBold'>
            {selected?.user?.name || ''}
          </Typography>
        </Stack>
        <Box
          sx={{
            minWidth: '180px',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Typography
            className='smallBodyBold'
            sx={{
              fontWeight: 'bold',
            }}
          >
            {t('Posted')}:
          </Typography>
          <Typography className='smallBody' ml={1}>
            {selected.posted}
          </Typography>
        </Box>
      </Stack>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        my={2}
      >
        <Typography
          className='h5'
          sx={{
            fontWeight: 'bold',
          }}
        >
          {t('Summary')}
        </Typography>
        <Box
          sx={{
            minWidth: '180px',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Typography
            className='smallBodyBold'
            sx={{
              fontWeight: 'bold',
            }}
          >
            {t('Format')}:
          </Typography>
          <Typography className='smallBody' ml={1}>
            {selected.format}
          </Typography>
        </Box>
      </Stack>
      <Typography className='body'>{selected.description}</Typography>
    </Box>
  );
}

export default PresentationInfo;
