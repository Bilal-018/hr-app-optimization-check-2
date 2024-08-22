import React, { useState, useEffect } from 'react';
import EnhancedTable from '../Global/Table';
import { Box, Button, Grid } from '@mui/material';
import { CircularChip } from '../Global/Chips';
import AddNewLeave from './AddNewLeave';
import { jwtLeave } from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import BankHolidaySetting from './BankHolidaySetting';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import { AxiosResponse } from 'axios';

const headCells = [
  {
    id: 'Leave',
    label: 'Leave',
  },
  {
    id: 'Limitation',
    label: 'Limitation',
  },
  {
    id: 'Daysentitled',
    label: 'Days entitled',
  },
  {
    id: 'Action',
    label: 'Action',
  },
];

function createData(
  Leave: string,
  Limitation: string,
  Daysentitled: number,
  id: number,
  // eslint-disable-next-line
  onEdit: (id: number) => void,
  // eslint-disable-next-line
  onDelete: (id: number) => void
) {

  // Combine all text for searchable text
  const searchableText = [
    Leave,
    Limitation,
    Daysentitled,
  ].join(' ');

  return {
    Leave,
    Limitation: Limitation ? Limitation : 'N/A',
    Daysentitled: <CircularChip value={Daysentitled} />,
    Action: (
      <CellAction onEdit={() => { onEdit(id) }} id={id} onDelete={() => { onDelete(id) }} />
    ),
    searchableText,
  };
}

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

interface ModalState {
  open: boolean;
  id: number | null;
}

interface LeaveTypeState {
  leaveTypeId?: number;
  leaveType: string;
  daysEntitled: number;
  genderRestriction: string;
  leaveCategoryId: number | null;
  contractTypeId: number[];
  genderRestrictionId: number[],
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

function Assets() {
  const [open, setOpen] = useState<ModalState>({
    open: false,
    id: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;
  const [leaveConfig, setLeaveConfig] = useState<LeaveTypeState[]>([]);
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    open: false,
    id: null,
  });

  const getLeaveConfig = () => {
    setLoading(true);
    jwtLeave
      .get('api/LeaveConfiguration/GetAllLeaveConfiguration')
      .then((res: AxiosResponse<LeaveTypeState[]>) => {
        setLeaveConfig(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          showMessage(err.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
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

  const updateLeaveConfig = (data: LeaveTypeState) => {
    jwtLeave
      .post('api/LeaveConfiguration/UpdateLeaveConfiguration', data)
      .then(() => {
        showMessage('Leave configuration updated successfully', 'success');
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          showMessage(err.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      }).finally(() => { setLoading(false) });
  }

  const createMewLeaveConfig = (data: LeaveTypeState) => {
    jwtLeave
      .post('api/LeaveConfiguration/CreateLeaveConfiguration', data)
      .then(() => {
        showMessage('Leave configuration created successfully', 'success');
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          showMessage(err.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      }).finally(() => { setLoading(false) });
  }

  const deleteLeaveConfig = (id: number) => {
    jwtLeave
      .delete(
        `api/LeaveConfiguration/DeleteLeaveConfiguration?leaveTypeId=${id}`
      )
      .then(() => {
        showMessage('Leave configuration deleted successfully', 'success');
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          showMessage(err.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const onDeleteConfirm = () => {
    if (deleteModal.id !== null) {
      deleteLeaveConfig(deleteModal.id);
      getLeaveConfig();
      setDeleteModal({
        open: false,
        id: null,
      });
    }
  };

  const onSave = (data: LeaveTypeState) => {
    setLoading(true);
    if (data.leaveTypeId) {
      updateLeaveConfig(data);
    } else {
      createMewLeaveConfig(data);
    }

    getLeaveConfig();

    setOpen({
      open: false,
      id: null,
    });
  };

  useEffect(() => {
    getLeaveConfig();
  }, []);

  return (
    <>
      <Grid
        sx={() => ({
          padding: '10px',
          alignItems: 'flex-start',
        })}
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={(theme) => ({
            borderRadius: '10px',
            border: `0px solid ${theme.palette.common.black}`,
            mt: 2,
          })}
        >
          <EnhancedTable
            head={headCells}
            rows={leaveConfig.map((item: LeaveTypeState) =>
              createData(
                item.leaveType,
                item.genderRestriction,
                item.daysEntitled,
                item.leaveTypeId ?? 0,
                onEdit,
                onDelete
              )
            )}
            isAddable={true}
            onAddClick={() => {
              setOpen({
                open: true,
                id: null,
              })
            }}
            title='Leave Configuration'
            loading={loading}
            btnTitle='Edit'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BankHolidaySetting />
        </Grid>
      </Grid>
      <AddNewLeave
        open={open.open}
        handleClose={() => {
          setOpen({
            open: false,
            id: null,
          });
        }}
        handleSave={onSave}
        leave={leaveConfig.find((item: LeaveTypeState) => item.leaveTypeId === open.id)}
        loading={loading}
      />
      <DeleteModal
        open={deleteModal.open}
        message={'Are you sure you want to delete this leave?'}
        title={'Delete leave'}
        onCancel={() => {
          setDeleteModal({
            open: false,
            id: null,
          });
        }}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}

export default Assets;
