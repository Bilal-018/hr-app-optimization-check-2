import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  alpha,
} from '@mui/material';
import AddNewContract from './AddNewContract';
import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import { t } from 'i18next';
import { Stack } from 'rsuite';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import { AxiosError, AxiosResponse } from 'axios';

interface CellActionProps {
  // eslint-disable-next-line
  onEdit: (id: number) => void;
  id: number;
  // eslint-disable-next-line
  onDelete: (id: number) => void;
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
// function createData(contract: any, onEdit: any, onDelete: any) {
//   return {
//     contractType: contract.contractType,
//     Action: <CellAction onEdit={onEdit} id={contract.id} onDelete={onDelete} />,
//   };
// }

interface NewContract {
  open: boolean;
  id: number | null;
}

interface ContractType {
  id: number,
  contractType: string
}

interface ContractTypeData {
  contractTypeId: number,
  contractType: string
}

interface DeleteModalState {
  open: boolean;
  id: number | null;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

const Contractstable: React.FC = () => {
  const [newContract, setNewContract] = useState<NewContract>({
    open: false,
    id: null,
  });
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    id: null,
  });
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const getContractTypeData = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/ContractTypeMasters/GetAllContractType')
      .then((res: AxiosResponse<ContractTypeData[]>) => {
        setContracts(
          res.data.map((contract: ContractTypeData) => ({
            id: contract.contractTypeId,
            contractType: contract.contractType,
          }))
        );
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
  }

  useEffect(() => {
    getContractTypeData();
  }, []);

  const handleClose = () => {
    setNewContract({
      open: false,
      id: null,
    });
  };

  const updateContract = (contractName: string) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/ContractTypeMasters/UpdatedContractType', {
        contractTypeId: newContract.id,
        contractType: contractName,
      })
      .then(() => {
        showMessage('Contract type Updated successfully', 'success');
        setContracts((pre: ContractType[]) =>
          pre.map((con: ContractType) =>
            con.id === newContract.id
              ? { ...con, contractType: contractName }
              : con
          )
        );
        handleClose();
        getContractTypeData();
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

  const addNewContract = (contractName: string) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/ContractTypeMasters/CreateContractTypeDetail', {
        contractType: contractName,
      })
      .then((res: AxiosResponse<ContractTypeData>) => {
        showMessage('Contract type Added successfully', 'success');
        setContracts((pre: ContractType[]) => [
          ...pre,
          {
            id: res.data.contractTypeId,
            contractType: contractName,
          },
        ]);
        handleClose();
        getContractTypeData();
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
      .finally(() => setLoading(false));
  };

  const deleteContract = (id: number | null) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .delete(`api/ContractTypeMasters/DeleteContractType?ContractTypeId=${id}`)
      .then(() => {
        showMessage('Contract type deleted successfully', 'success');
        setContracts((pre: ContractType[]) => pre.filter((con: ContractType) => con.id !== id));
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
      .finally(() => setLoading(false));
  };

  const handleSave = (contractName: string) => {
    if (newContract.id) {
      updateContract(contractName);
      return;
    }

    addNewContract(contractName);
  };

  const onEdit = (id: number) => {
    setNewContract({
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
      <Typography
        sx={{
          mt: 2,
        }}
      >
        {' '}
        Setup the relevant contract type used in your organization
      </Typography>

      <Button
        sx={{
          padding: 0,
          textTransform: 'capitalize',
          background: 'transparent',
          my: 1,
        }}
        onClick={() => { setNewContract({ open: true, id: null }) }}
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
          {t('Add contract type')}
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
          <span>{t('Contract type')}</span>
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
            {contracts.map((value: ContractType) => {
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
                    {t(value.contractType)}
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

      <AddNewContract
        open={newContract.open}
        handleClose={handleClose}
        handleSave={handleSave}
        value={
          newContract.id
            ? contracts.find((item: ContractType) => item.id === newContract.id)
              ?.contractType
            : ''
        }
      />

      <DeleteModal
        message={'Are you sure you want to delete this contract type?'}
        onCancel={() => {
          setDeleteModal({
            open: false,
            id: null,
          })
        }}
        onConfirm={() => { deleteContract(deleteModal.id) }}
        open={deleteModal.open}
        title={'Delete Contract Type'}
      />
    </>
  );
};

export default Contractstable;
