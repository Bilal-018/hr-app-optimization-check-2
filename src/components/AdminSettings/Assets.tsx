/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import EnhancedTable from '../Global/Table';
import { Box, Button, alpha } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddNewAsset from './AddNewAsset';
import dayjs from 'dayjs';
import DeleteModal from '../Global/DeleteModal';
import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import { AxiosResponse } from 'axios';

const headCells = [
  {
    id: 'equipment',
    label: 'Equipment',
  },
  {
    id: 'brand',
    label: 'Brand',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'registration',
    label: 'Registration',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'Action',
    label: 'Action',
  },
];

function createData(
  equipment: string,
  brand: string,
  model: string,
  registration: string | null | undefined,
  expiryDate: string | null | undefined,
  id: number,
  // eslint-disable-next-line
  onEdit: (id: number) => void,
  // eslint-disable-next-line
  onDelete: (id: number) => void
) {
  return {
    equipment,
    brand,
    model,
    registration,
    expiryDate,
    Action: (
      <CellAction onEdit={() => { onEdit(id); }} onDelete={() => { onDelete(id); }} />
    ),
  };
}

// function Status({ status }: any) {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         gap: '5px',
//         alignItems: 'center',
//       }}
//     >
//       <Circle color={status === 'Active' ? 'success' : 'error'} />
//       <Typography className='smallBodyBold'>{status}</Typography>
//     </Box>
//   );
// }

interface CellActionProps {
  onEdit: () => void;
  onDelete: () => void;
}

function CellAction({ onEdit, onDelete }: CellActionProps) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        sx={{
          backgroundColor: alpha('#27AE60', 0.1),

          svg: {
            fill: '#27AE60',
          },
        }}
        onClick={onEdit}
      >
        <BorderColorIcon />
      </Button>
      <Button
        sx={{
          backgroundColor: alpha('#DF6F79', 0.1),

          svg: {
            fill: '#DF6F79',
          },
        }}
        onClick={onDelete}
      >
        <DeleteIcon />
      </Button>
      {/*<Button>
        <MoreVertIcon />
      </Button>*/}
    </Box>
  );
}

const Assets: React.FC = () => {

  interface ModalState {
    open: boolean;
    id: number | null;
  }

  //const [open, setOpen] = useState(false);
  const [open, setOpen] = useState<ModalState>({
    open: false,
    id: null,
  });

  interface DeleteModalState {
    open: boolean;
    id: number | null;
  }

  interface AssetConfig {
    assetConfigurationId: number;
    equipment: string;
    brand: string;
    model: string;
    registration: string | null;
    expiryDate: string;
    isActive?: boolean;
  }

  interface Snackbar {
    // eslint-disable-next-line
    showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;
  const [assetConfig, setAssetConfig] = useState<AssetConfig[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    id: null,
  });
  const getAssetConfig = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/HrAsset/GetAllAssetConfigurationList')
      .then((res: AxiosResponse<AssetConfig[]>) => {
        setAssetConfig(res.data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          showMessage((error as { message: string }).message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  };

  const updateAssetConfig = (data: AssetConfig) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api//HrAsset/UpdateAssetConfiguration', data)
      .then(() => {
        showMessage('Asset configuration updated successfully', 'success');
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          showMessage((error as { message: string }).message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  };

  const createNewAssetConfig = (data: AssetConfig) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/HrAsset/CreateAssetConfiguration', data)
      .then(() => {
        showMessage('Asset configuration created successfully', 'success');
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          showMessage((error as { message: string }).message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  };

  const deleteLeaveConfig = (id: number | null) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .delete(`api/HrAsset/DeleteAssetConfiguration?AssetConfigurationId=${id}`)
      .then(() => {
        showMessage('Asset configuration deleted successfully', 'success');
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          showMessage((error as { message: string }).message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => {
        getAssetConfig();
        setDeleteModal({
          open: false,
          id: null,
        });
      })
  };

  const onEdit = (id: number) => {
    setOpen({
      open: true,
      id: id,
    });
  };

  const onDelete = (id: number) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };
  const onDeleteConfirm = () => {
    deleteLeaveConfig(deleteModal.id);
  };

  const onSave = (data: AssetConfig) => {
    if (data.assetConfigurationId) {
      updateAssetConfig(data);
    } else {
      createNewAssetConfig(data);
    }

    getAssetConfig();

    setOpen({
      open: false,
      id: null,
    });
  };

  useEffect(() => {
    getAssetConfig();
  }, []);

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.common.black}`,
        borderRadius: '20px',
      })}
    >
      <EnhancedTable
        head={headCells}
        rows={assetConfig.map((item: AssetConfig) => {
          const formattedExpiryDate = typeof item.expiryDate === 'string' && dayjs(item.expiryDate).isValid()
            ? dayjs(item.expiryDate).format('DD/MM/YYYY')
            : '';
          createData(
            item.equipment,
            item.brand,
            item.model,
            item.registration ?? '',
            formattedExpiryDate,
            item.assetConfigurationId,
            onEdit,
            onDelete
          )
        })}
        isAddable={true}
        onAddClick={() => {
          setOpen({
            open: true,
            id: null,
          })
        }}
        title='Asset Configuration'
        loading={loading}
      />
      <AddNewAsset
        open={open.open}
        handleClose={() => {
          setOpen({
            open: false,
            id: null,
          });
        }}
        handleSave={onSave}
        asset={assetConfig.find(
          (item: AssetConfig) => item.assetConfigurationId === open.id
        )}
      />

      <DeleteModal
        open={deleteModal.open}
        message={'Are you sure want to delete this Asset?'}
        title={'Delete Asset'}
        onCancel={() => {
          setDeleteModal({
            open: false,
            id: null,
          });
        }}
        onConfirm={onDeleteConfirm}
      />
    </Box>
  );
};

export default Assets;
