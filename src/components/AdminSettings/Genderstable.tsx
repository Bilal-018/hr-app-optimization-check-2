import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  alpha,
} from '@mui/material';
import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import { t } from 'i18next';
import { Stack } from 'rsuite';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import AddNewGender from './AddNewGender';

function CellAction({ onEdit, id, onDelete }: any) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={() => onEdit(id)}
      >
        <EditIcon />
      </Button>
      <Button
        onClick={() => onDelete(id)}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

const Genderstable: React.FC = () => {
  const [newGender, setNewGender] = useState<any>({
    open: false,
    id: null,
  });
  const [genders, setGenderData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    open: false,
    id: null,
  });
  const { showMessage }: any = useSnackbar();

  const getGenderData = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/GenderMaster/GetAllGenderMasters')
      .then((res: any) => {
        setGenderData(
          res.data.map((item: any) => ({
            id: item.genderId,
            value: item.gender,
          }))
        );

        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });
  }

  useEffect(() => {
    getGenderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setNewGender({
      open: false,
      id: null,
    });
  };
  const updateGender = (gender: any) => {
    setLoading(true);
    jwtInterceoptor
      .post('api/GenderMaster/UpdatedGenderMaster', {
        genderId: newGender.id,
        gender: gender,
      })
      .then(() => {
        showMessage('Gender Updated successfully', 'success');
        setGenderData((pre: any) =>
          pre.map((con: any) =>
            con.id === newGender.id
              ? { ...con, value: gender }
              : con
          )
        );
        handleClose();
        getGenderData();
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => { setLoading(false) });
  };

  const addNewGender = (gender: any) => {
    setLoading(true);
    jwtInterceoptor
      .post('api/GenderMaster/CreateGenderMaster', {
        gender: gender,
      })
      .then((res: any) => {
        showMessage('Gender added successfully', 'success');
        setGenderData((pre: any) => [
          ...pre,
          {
            id: res.data.genderId,
            value: gender,
          },
        ]);
        handleClose();
        getGenderData();
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const deleteGender = (id: any) => {
    setLoading(true);
    jwtInterceoptor
      .delete(`api/GenderMaster/DeleteGenderMaster?GenderId=${id}`)
      .then(() => {
        showMessage('Gender deleted successfully', 'success');
        setGenderData((pre: any) => pre.filter((con: any) => con.id !== id));
        setDeleteModal({
          open: false,
          id: null,
        });
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handleSave = (gender: any) => {
    if (newGender.id) {
      updateGender(gender);
      return;
    }

    addNewGender(gender);
  };

  const onEdit = (id: any) => {
    setNewGender({
      open: true,
      id,
    });
  };

  const onDelete = (id: any) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };

  return (
    <>
      <Button
        sx={{
          padding: 0,
          textTransform: 'capitalize',
          background: 'transparent',
        }}
        onClick={() => setNewGender({ open: true, id: null })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px !important', // Ensuring the width with !important
            height: '32px',
            minWidth: '32px', // Ensure minimum width matches
            borderRadius: '100%',
            backgroundColor: alpha('#18A0FB', 1),
            '& svg': {
              fill: '#FFFFFF',
            },
          }}
        >
          <AddIcon />
        </Box>
        <Typography
          sx={{
            marginLeft: '8px', // Adjust spacing between icon and text as needed
            fontWeight: '500',
          }}
        >
          {t('Add gender')}
        </Typography>
      </Button>
      <Box
        sx={{
          p: 0,
          boxShadow:
            '0px 1px 5px -5px #00000040, 0px 1px 14px -5px #0000001F, 0px 1px 10px -5px #00000024',
          border: '0.5px solid #092C4C4D',
          maxWidth: '550px',
        }}
        className='section-border'
      >
        <Stack
          style={{
            borderBottom: '0.5px solid #092C4C4D',
            padding: '15px 10px',
            fontSize: '14px',
            fontWeight: '700',
          }}
        >
          <span>{t('Gender')}</span>
        </Stack>
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
          <Box style={{ padding: '0 5px' }}>
            {genders.map((value: any) => {
              return (
                <Stack
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 10px',
                  }}
                >
                  <Typography
                    key={value.id}
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {t(value.value)}
                  </Typography>
                  <CellAction
                    id={value.id}
                    onEdit={() => onEdit(value.id)}
                    onDelete={() => onDelete(value.id)}
                  />
                </Stack>
              );
            })}
          </Box>
        )}
      </Box>

      <AddNewGender
        open={newGender.open}
        handleClose={handleClose}
        handleSave={handleSave}
        value={
          newGender.id
            ? genders.find((item: any) => item.id === newGender.id).value
            : ''
        }
      />

      <DeleteModal
        message={'Are you sure you want to delete this Gender?'}
        onCancel={() =>
          setDeleteModal({
            open: false,
            id: null,
          })
        }
        onConfirm={() => deleteGender(deleteModal.id)}
        open={deleteModal.open}
        title={'Delete Gender'}
      />
    </>
  );
};

export default Genderstable;
