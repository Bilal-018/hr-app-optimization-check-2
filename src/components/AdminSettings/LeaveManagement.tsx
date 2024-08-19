import React, { useState } from 'react';
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
  Leave: any,
  Limitation: any,
  Daysentitled: any,
  id: any,
  onEdit: any,
  onDelete: any
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
      <CellAction onEdit={() => onEdit(id)} onDelete={() => onDelete(id)} />
    ),
    searchableText,
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

function Assets() {
  const [open, setOpen] = useState<any>({
    open: false,
    id: null,
  });
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [leaveConfig, setLeaveConfig] = useState<any>([]);
  const [deleteModal, setDeleteModal] = useState<any>({
    open: false,
    id: null,
  });

  const getLeaveConfig = () => {
    setLoading(true);
    jwtLeave
      .get('api/LeaveConfiguration/GetAllLeaveConfiguration')
      .then((res) => {
        setLeaveConfig(res.data);
        setLoading(false);
      })
      .catch((err) => {
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

  const updateLeaveConfig = async (data: any) =>
    jwtLeave
      .post('api/LeaveConfiguration/UpdateLeaveConfiguration', data)
      .then(() => {
        showMessage('Leave configuration updated successfully', 'success');
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      }).finally(() => { setLoading(false) });

  const createMewLeaveConfig = async (data: any) =>
    jwtLeave
      .post('api/LeaveConfiguration/CreateLeaveConfiguration', data)
      .then(() => {
        showMessage('Leave configuration created successfully', 'success');
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      }).finally(() => { setLoading(false) });

  const deleteLeaveConfig = async (id: any) =>
    jwtLeave
      .delete(
        `api/LeaveConfiguration/DeleteLeaveConfiguration?leaveTypeId=${id}`
      )
      .then(() => {
        showMessage('Leave configuration deleted successfully', 'success');
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      });

  const onDeleteConfirm = async () => {
    await deleteLeaveConfig(deleteModal.id);
    getLeaveConfig();
    setDeleteModal({
      open: false,
      id: null,
    });
  };

  const onSave = async (data: any) => {
    setLoading(true);
    if (data.leaveTypeId) {
      await updateLeaveConfig(data);
    } else {
      await createMewLeaveConfig(data);
    }

    getLeaveConfig();

    setOpen({
      open: false,
      id: null,
    });
  };

  React.useEffect(() => {
    getLeaveConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            rows={leaveConfig.map((item: any) =>
              createData(
                item.leaveType,
                item.genderRestriction,
                item.daysEntitled,
                item.leaveTypeId,
                onEdit,
                onDelete
              )
            )}
            isAddable={true}
            onAddClick={() =>
              setOpen({
                open: true,
                id: null,
              })
            }
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
        leave={leaveConfig.find((item: any) => item.leaveTypeId === open.id)}
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
