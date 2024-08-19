import {
  Box,
  Button,
  Drawer,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import CircularIcon from '../Global/CircularIcon';
import UploadSection from './UploadSection';

const initialState = {
  title: '',
  description: '',
  presentations: [],
};

function EditPresentations({ open, onClose, id, onSave, data }: any) {
  const { t } = useTranslation();
  const userTheme = useTheme();

  const [presentationData, setPresentationData] = useState<any>(
    data || initialState
  );

  useEffect(() => {
    if (data) {
      setPresentationData(data);
    }
  }, [data, open]);

  const handleClose = () => {
    setPresentationData(initialState);
    setPresentationData([]);
    onClose();
  };

  const handleSave = () => {
    const formDataFiles = new FormData();
    for (const prsnt of presentationData.presentations) {
      const url = prsnt?.url;
      if (typeof url !== 'string') {
        formDataFiles.append('files', url);
      }
    }
    formDataFiles.append('Title', presentationData.title);
    formDataFiles.append('Description', presentationData.description);
    formDataFiles.append(
      'IsVisibleToUser',
      presentationData.isVisibleToUser ?? false
    );

    if (id) {
      formDataFiles.append('CompanyDetailId', id);
    }

    // find files removed from the list
    const removedFiles = data?.presentations?.filter(
      (item: any) => !presentationData.presentations.includes(item)
    );

    onSave({
      formDataFiles,
      removedFiles,
    });
    setPresentationData(initialState);
    onClose();
  };
  const inputChange = (e: any) => {
    const { name, value } = e.target;
    setPresentationData((pre: any) => ({ ...pre, [name]: value }));
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: 'transparent',
          justifyContent: 'end',
          boxShadow: 'none',
          px: 2,

          '@media (max-width: 600px)': {
            width: '100%',
            px: 0,
          },
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          background: 'transparent',
        },
      }}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: '600px',
          minWidth: '600px',
          padding: '20px',
          height: '90%',
          overflow: 'auto',
          zIndex: '1000',
          background: theme.palette.background.paper,
          borderRadius: '20px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',

          '@media (max-width: 600px)': {
            minWidth: '100%',
            borderRadius: '0px',
            height: '100%',
          },
        })}
      >
        <CircularIcon
          icon={<CloseIcon />}
          color={userTheme.palette.mode === 'dark' ? '#fafafa' : '#092C4C'}
          onClick={handleClose}
          sx={{
            width: '30px',
            height: '30px',
            marginLeft: 'auto',
          }}
        />

        <Typography
          variant='h6'
          sx={{
            color: '#FF1B1B',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'underline',
            marginBottom: '10px',
          }}
        >
          {t('Delete content')}
        </Typography>

        <Stack
          direction='column'
          justifyContent={'space-between'}
          sx={{
            height: '90%',
          }}
        >
          <div>
            <Typography variant='h6'>{t('Title')}</Typography>

            <TextField
              fullWidth
              placeholder={t('Enter title').toString()}
              variant='outlined'
              sx={{
                my: 2,
                background: 'transparent !important',
              }}
              name='title'
              onChange={inputChange}
              value={presentationData.title}
            />

            <Typography variant='h6'>{t('Summary')}</Typography>

            <TextField
              multiline
              fullWidth
              rows={5}
              placeholder={t('Enter Summary').toString()}
              variant='outlined'
              sx={{
                mt: 2,
                background: 'transparent !important',
              }}
              name='description'
              onChange={inputChange}
              value={presentationData.description}
            />

            <UploadSection
              title='Attachments'
              state={presentationData.presentations ?? []}
              setState={(data: any) => {
                setPresentationData((pre: any) => ({
                  ...pre,
                  presentations: data,
                }))
              }}
            />
            <Stack
              direction='row'
              sx={{
                mt: 2,
              }}
              alignItems={'center'}
            >
              <Typography className='body' m={0}>
                {t('Visible to user')}
              </Typography>
              <Switch
                checked={presentationData.isVisibleToUser}
                onChange={(e) =>
                  setPresentationData((pre: any) => ({
                    ...pre,
                    isVisibleToUser: e.target.checked,
                  }))
                }
              />
            </Stack>
          </div>
          <Stack
            direction='row'
            justifyContent='space-around  '
            alignItems='center'
            mt={4}
          >
            <Button
              variant='outlined'
              sx={{
                m: 0,
                borderRadius: '10px',
                fontWeight: '400',
                maxWidth: '150px',
              }}
              onClick={handleClose}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant='contained'
              sx={{
                m: 0,
                borderRadius: '10px',
                fontWeight: '400',
                maxWidth: '150px',
              }}
              onClick={handleSave}
            >
              {t('Save')}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

export default EditPresentations;
