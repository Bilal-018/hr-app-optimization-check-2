import React, { useState } from 'react';
import EnhancedTable from '../Global/Table';
import { Box, Button, Typography, Stack } from '@mui/material';
import AssetsModal from './Assets/AssetsModal';
import DeleteModal from '../Global/DeleteModal';
import CircleIcon from "@mui/icons-material/Circle";
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';

interface Row {
  employeeId: string;
  fullName: string;
  department: string;
  lineManager: string;
  startingDate: string;
  status: React.ReactNode;
  Action: React.ReactNode;
}

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

function extractTextFromElement(element: React.ReactElement): string {
  if (typeof element.props.children === 'string') {
    return element.props.children;
  }

  if (Array.isArray(element.props.children)) {
    return element.props.children.map((child: any) => 
      React.isValidElement(child) ? extractTextFromElement(child) : child
    ).join(' ');
  }

  if (React.isValidElement(element.props.children)) {
    return extractTextFromElement(element.props.children);
  }

  return '';
}

function createData(
  equipment: any,
  brand: any,
  model: any,
  registration: any,
  status: any,
  action: any
) {
  const searchableText = [
    equipment,
    brand,
    model,
    registration,
    extractTextFromElement(status),
  ].join(' ');

  return {
    equipment,
    brand,
    model,
    registration,
    status,
    action,
    searchableText,
  };
}

function CellAction({ onEdit, onDelete }: any) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={onEdit}
      >
        <EditIcon />
      </Button>
      <Button
        onClick={onDelete}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

function EmployeeSkillsTable() {
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [assetConfig, setAssetConfig] = useState<any>([]);
  const [deleteModal, setDeleteModal] = useState<any>({
    open: false,
    id: null,
  });
  const [open, setOpen] = useState<any>({
    open: false,
    id: null,
  });

  const getAssetConfig = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/HrAsset/GetAllAssetConfigurationList')
      .then((res: any) => {
        if (res.data?.allAssets) {
          setAssetConfig(res.data.allAssets);
        } else {
          setAssetConfig([]);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });
  };

  const updateAssetConfig = (data: any) => {
    setLoading(true);

    jwtInterceoptor
      .post('api//HrAsset/UpdateAssetConfiguration', data)
      .then(() => {
        showMessage('Asset configuration updated successfully', 'success');
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });
  };

  const createNewAssetConfig = (data: any) => {
    setLoading(true);
    jwtInterceoptor
      .post('api/HrAsset/CreateAssetConfiguration', data)
      .then(() => {
        showMessage('Asset configuration created successfully', 'success');
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });
  };

  const deleteLeaveConfig = async (id: any) => {
    setLoading(true);

    jwtInterceoptor
      .delete(`api/HrAsset/DeleteAssetConfiguration?AssetConfigurationId=${id}`)
      .then(() => {
        showMessage('Asset configuration deleted successfully', 'success');
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });
  };

  const onEdit = (id: any) => {
    setOpen({
      open: true,
      id: id,
    });
  };

  const onDelete = (id: any) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };
  const onDeleteConfirm = async () => {
    await deleteLeaveConfig(deleteModal.id);
    getAssetConfig();
    setDeleteModal({
      open: false,
      id: null,
    });
  };

  const onSave = async (data: any) => {
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

  React.useEffect(() => {
    getAssetConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const rows: Row[] = assetConfig.map((item: any) =>
    createData(
      item.equipment,
      item.brand,
      item.model,
      item.registration != null &&
        item.registration != '' &&
        item.registration != 'string'
        ? item?.registration
        : '',
      <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
        <CircleIcon color={item.isActive ? "success" : "error"} fontSize="inherit" />
        <Typography sx={{ fontSize: 12 }}>{item.isActive? 'Active':'Deactivate'}</Typography>
      </Stack>,
      <CellAction onEdit={() => onEdit(item.assetConfigurationId)} onDelete={() => onDelete(item.assetConfigurationId)} />
    )
  );

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={rows}
        isAddable={true}
        onAddClick={() =>
          setOpen({
            open: true,
            id: null,
          })
        }
        title='Assets'
        btnTitle='Add New'
        loading={loading}
      />
      <AssetsModal
        open={open.open}
        handleClose={() => {
          setOpen({
            open: false,
            id: null,
          });
        }}
        onSave={onSave}
        title='Add new asset'
        data={assetConfig.find(
          (item: any) => item.assetConfigurationId === open.id
        )}
        setData={function (value: any): void {
          throw new Error('Function not implemented.');
        }}
      />
      <DeleteModal
        message='Are you sure you want to delete this Asset?'
        open={deleteModal.open}
        onCancel={() => {
          setDeleteModal({
            open: false,
            id: null,
          });
        }}
        title='Delete Asset'
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}

export default EmployeeSkillsTable;
