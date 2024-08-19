import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { t } from 'i18next';
import { alpha } from "@mui/material/styles";

const noop = () => { /* do nothing */ };

function EditAndSave({
  edit,
  setEdit,
  onSave = noop,
  onUpdate = noop,
  onCancel = noop,
  showConfirm = true,
  modal = false,
  title = '',
  fileAdded = false,
}: any) {

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  };

  const cancelBtnStyle = (theme: any) => ({
    fontWeight: 500,
    fontSize: "14px",
    padding: "15px 40px",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    borderRadius: "10px",
    boxShadow: "none",
    width: "fit-content",
    m: 0,

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  });

  const saveBtnStyle = (theme: any) => ({
    fontWeight: 500,
    fontSize: "14px",
    padding: "15px 40px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
    boxShadow: "none",
    width: "fit-content",
    m: 0,

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        ml: 'auto',
        flexWrap: 'wrap',

        ...(edit && {
          width: '100%',
          justifyContent: 'flex-end',
        }),
      }}
    >
      {showConfirm && edit ? (
        modal ? (
          <>
            <Box sx={buttonContainerStyle}>
              <Button
                variant="contained"
                sx={cancelBtnStyle}
                disabled={(modal && title === 'Documents' && !fileAdded) ? true : false}
                onClick={() => {
                  setEdit(false);
                  onCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={saveBtnStyle}
                disabled={(modal && title === 'Documents' && !fileAdded) ? true : false}
                onClick={() => {
                  onUpdate();
                }}
              >
                Save
              </Button>
            </Box>
          </>) : (
          <>
            <CancelRoundedIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setEdit(false);
                onCancel();
              }}
              style={{ width: '40px', height: '40px' }}
              color='error'
            />
            <CheckCircleRoundedIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                onUpdate();
              }}
              style={{ width: '40px', height: '40px' }}
              color='success'
            />
          </>)) : (
        <Button
          sx={{
            padding: 0,
            textTransform: 'capitalize',
            background: 'transparent',
          }}
          onClick={() => {
            setEdit(true);
            onSave();
          }}
        >
          <Typography
            sx={{
              fontWeight: '500',
            }}
          >
            {t('Edit')}
          </Typography>
        </Button>
      )}
    </Box>
  );
}

// <PenIcon
//   sx={{ cursor: 'pointer', display: isManagerOrAdmin }}
//   onClick={() => {
//     setEdit(true);
//     onSave();
//   }}
// />
export default EditAndSave;
