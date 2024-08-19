import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import BaseModal from '../Global/Modal';
import DragAndDrop from '../Global/DragAndDrop';
import Upload from '../../assets/images/Upload';

function UploadSection({ state, setState, title }: any) {
  const { t } = useTranslation();
  const [tempFiles, settempFiles] = useState<any>([]);

  const [openUpload, setOpenUpload] = useState<any>(false);

  const handleFile = (e: any) => {
    const files = e.target.files;
    const newFiles = [];
    for (const file of files) {
      newFiles.push({
        name: file.name,
        url: file,
      });
    }
    settempFiles([...tempFiles, ...newFiles]);
  };

  const handleDelete = (index: any) => {
    const newState = [...state];
    newState.splice(index, 1);
    setState(newState);
  };

  return (
    <Box
      sx={{
        borderTop: () => `0.5px solid #092C4C`,
        pt: '20px',
        mt: '20px',
      }}
    >
      <Typography
        className='body'
        sx={{
          fontWeight: 'bold',
        }}
      >
        {t(title)}
      </Typography>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={(theme) => ({
          p: '10px',
          borderRadius: '20px',
          mt: '17px',
          background: theme.palette.mode === 'dark' ? '#212332' : '#F7F8FB',
        })}
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          {state?.length > 0 &&
            state?.map((item: any, index: any) => {
              return (
                <Chip
                  sx={{
                    background: 'white',
                  }}
                  onDelete={() => { handleDelete(index) }}
                  label={item.name}
                  key={index}
                />
              );
            })}
        </Box>
        <IconButton color='primary' onClick={() => { setOpenUpload(true) }}>
          {/* <CloudUploadIcon /> */}
          <Upload />
        </IconButton>
      </Stack>
      <Stack direction='row' alignItems='center' flexWrap={'wrap'}>
        {state?.map((item: any, index: any) => {
          return (
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              spacing={1}
              key={index}
            >
              <IconButton color='primary'>
                <ArticleIcon />
              </IconButton>
              <Typography className='smallBodyBold'>{item.name}</Typography>
              <IconButton onClick={() => { handleDelete(index) }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
      <BaseModal
        open={openUpload}
        showSaveButton
        title={`Upload New ${title}`}
        handleClose={() => { setOpenUpload(false) }}
        onSave={() => {
          setState([...state, ...tempFiles]);
          setOpenUpload(false);
          settempFiles([]);
        }}
      >
        <DragAndDrop
          allowMultiple
          onChangeFile={handleFile}
          sx={{
            margin: 'auto',
          }}
        />
      </BaseModal>
    </Box>
  );
}

export default UploadSection;
