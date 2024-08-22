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
import { AxiosError, AxiosResponse } from 'axios';

interface CellActionProps {
  // eslint-disable-next-line
  onEdit: (id: number) => void;
  // eslint-disable-next-line
  onDelete: (id: number) => void;
  id: number;
}

function CellAction({ onEdit, id, onDelete }: CellActionProps) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={() => { onEdit(id) }}
      >
        <EditIcon />
      </Button>
      <Button
        onClick={() => { onDelete(id) }}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

interface ModalState {
  open: boolean;
  id: number | null;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

interface GenderState {
  genderId: number;
  gender: string;
}

interface Gender {
  id: number;
  value: string;
}

const Genderstable: React.FC = () => {
  const [newGender, setNewGender] = useState<ModalState>({
    open: false,
    id: null,
  });
  const [genders, setGenderData] = useState<Gender[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    open: false,
    id: null,
  });
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const getGenderData = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/GenderMaster/GetAllGenderMasters')
      .then((res: AxiosResponse<GenderState[]>) => {
        setGenderData(
          res.data.map((item: GenderState) => ({
            id: item.genderId,
            value: item.gender,
          }))
        );

        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  useEffect(() => {
    getGenderData();
  }, []);

  const handleClose = () => {
    setNewGender({
      open: false,
      id: null,
    });
  };

  const updateGender = (gender: string) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/GenderMaster/UpdatedGenderMaster', {
        genderId: newGender.id,
        gender: gender,
      })
      .then(() => {
        showMessage('Gender Updated successfully', 'success');
        setGenderData((pre: Gender[]) =>
          pre.map((con: Gender) =>
            con.id === newGender.id
              ? { ...con, value: gender }
              : con
          )
        );
        handleClose();
        getGenderData();
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => { setLoading(false) });
  };

  const addNewGender = (gender: string) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/GenderMaster/CreateGenderMaster', {
        gender: gender,
      })
      .then((res: AxiosResponse<GenderState>) => {
        showMessage('Gender added successfully', 'success');
        setGenderData((pre: Gender[]) => [
          ...pre,
          {
            id: res.data.genderId,
            value: gender,
          },
        ]);
        handleClose();
        getGenderData();
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => { setLoading(false) });
  };

  const deleteGender = (id: number) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .delete(`api/GenderMaster/DeleteGenderMaster?GenderId=${id}`)
      .then(() => {
        showMessage('Gender deleted successfully', 'success');
        setGenderData((pre: Gender[]) => pre.filter((con: Gender) => con.id !== id));
        setDeleteModal({
          open: false,
          id: null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => { setLoading(false) });
  };

  const handleSave = (gender: string) => {
    if (newGender.id) {
      updateGender(gender);
      return;
    }

    addNewGender(gender);
  };

  const onEdit = (id: number) => {
    setNewGender({
      open: true,
      id,
    });
  };

  const onDelete = (id: number) => {
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
        onClick={() => { setNewGender({ open: true, id: null }) }}
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
            {genders.map((value: Gender) => {
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
                    onEdit={() => { onEdit(value.id) }}
                    onDelete={() => { onDelete(value.id) }}
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
            ? genders.find((item: Gender) => item.id === newGender.id)?.value
            : ''
        }
      />

      <DeleteModal
        message={'Are you sure you want to delete this Gender?'}
        onCancel={() => {
          setDeleteModal({
            open: false,
            id: null,
          })
        }}
        onConfirm={() => {
          if (deleteModal.id !== null) {
            deleteGender(deleteModal.id)
          }
        }}
        open={deleteModal.open}
        title={'Delete Gender'}
      />
    </>
  );
};

export default Genderstable;
