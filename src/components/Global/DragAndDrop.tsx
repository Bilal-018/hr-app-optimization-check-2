import { Box, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
// import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { errorHelperText } from '../../utils/validation';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from './WithSnackbar';
import Drop from '../../assets/images/Drop';

const noop = () => { /* do nothing */ };

function DragAndDrop({
  edit = true,
  type = '.pdf, .doc, .docx, .ppt, .pptx, .mp4, .mp3',
  onChangeFile = noop,
  sx = {},
  allowMultiple = false,
  error = false,
  defaultFileName,
  setFilesName = noop,
  fileAdded = true
}: any) {
  const inputRef: any = useRef();
  const [fileName, setFileName] = useState<any>(defaultFileName);
  const { showMessage }: any = useSnackbar();

  const isFileUnder20MB = (file: any) => {
    return file.size / 1024 / 1024 < 20;
  };

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const formatedFilesName = acceptedFiles
        .map((file: any) => file.name)
        .join(', ');

      for (const file of acceptedFiles) {
        if (!isFileUnder20MB(file)) {
          showMessage('File size should be less than 20MB', 'error');
          return;
        }
      }

      setFileName(formatedFilesName);
      setFilesName(formatedFilesName);
      onChangeFile({
        target: {
          name: 'file',
          files: acceptedFiles,
        },
      });
    },
    [onChangeFile, showMessage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type,
  });

  const handleChangeFile = (e: any) => {
    const files = e.target.files;
    const formatedFilesName = Array.from(files)
      .map((file: any) => file.name)
      .join(', ');
    setFileName(formatedFilesName);
    setFilesName(formatedFilesName);
    onChangeFile(e);
  };

  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          border: `2px dashed ${error ? '#FF0000' : '#18A0FB'}`,
          borderRadius: '10px',
          width: '100%',
          // height: 'auto',
          textAlign: 'center',
          mb: '20px',
          padding: '0 10px',
          maxWidth: '400px',
          minHeight: '250px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          ...(!edit && {
            opacity: 0.5,
            pointerEvents: 'none',
            cursor: 'not-allowed',
          }),
          ...sx,
        }}
        {...getRootProps()}
      >
        {/* <TextSnippetIcon sx={{ fontSize: '50px', color: '#4959ED' }} /> */}
        <Drop />

        <input
          type='file'
          ref={inputRef}
          style={{
            appearance: 'none',
            display: 'none',
          }}
          name='file'
          onChange={handleChangeFile}
          multiple={allowMultiple}
          accept={type}
          {...getInputProps()}
        />
        <Box>
          <Typography
            className='SmallBody'
            sx={{
              opacity: 0.7,
            }}
          >
            {isDragActive ? (
              <p>
                <strong>{t('Drop')}</strong>
                {t("it like it's hot 🔥")}
              </p>
            ) : (
              <p
                style={{
                  color: '#18A0FB',
                  fontWeight: 'bold',
                }}
              >
                {t('Click here to upload your document')}
              </p>
            )}
          </Typography>

          <Typography
            className='SmallBody'
            sx={{
              opacity: 0.7,
            }}
          >
            {t('or drag and drop it here')}
          </Typography>

          {/* <Typography
            className='SmallBodyBold'
            sx={{
              color: '#4959ED',
              cursor: 'pointer',
            }}
          >
            {t('Browse')}
          </Typography> */}
          {fileAdded && (
            <Typography
              className='SmallBodyBold'
              sx={{
                fontStyle: 'italic',
              }}
              display='block'
            >
              {fileName}
            </Typography>
          )}
        </Box>
      </Box>

      {error && errorHelperText(t('Please upload a file'))}
    </>
  );
}

export default DragAndDrop;
