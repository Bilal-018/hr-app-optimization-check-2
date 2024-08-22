import React, { useEffect, useState } from 'react';
import EnhancedTable from '../Global/Table';
import AddNewDepartment from './AddNewDepartment';
import { Box, Button, Typography, alpha } from '@mui/material';

import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import AddIcon from '@mui/icons-material/Add';
import { t } from 'i18next';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import { AxiosError, AxiosResponse } from 'axios';

function createData2(
  department: string,
  costCenter: string,
  // eslint-disable-next-line
  onEdit: (id: number) => void,
  // eslint-disable-next-line
  onDelete: (id: number) => void,
  id: number
) {
  return {
    department,
    costCenter,
    Action: <CellAction onEdit={onEdit} onDelete={onDelete} id={id} />,
  };
}

interface CellActionProps {
  // eslint-disable-next-line
  onEdit: (id: number) => void;
  // eslint-disable-next-line
  onDelete: (id: number) => void;
  id: number;
}

const noop = () => { /* do nothing */ };
function CellAction({ onEdit = noop, onDelete = noop, id }: CellActionProps) {
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

interface Departments {
  id: number | null;
  department: string;
  costCenter: string;
}

interface DepartmentsState {
  departmentId: number;
  department: string;
  costCenter: string;
}

interface ModalState {
  open: boolean;
  id: number | null;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

const DepartmentsTable: React.FC = () => {
  const [newDapartment, setNewDapartment] = useState<ModalState>({
    open: false,
    id: null,
  });
  const [DeleteDepartmentMaster, setDeleteDepartmentMaster] = useState<ModalState>({
    open: false,
    id: null,
  });

  const [departments, setDepartments] = useState<Departments[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const getDepartments = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/DepartmentMaster/GetAllDepartmentMasterList')
      .then((res: AxiosResponse<DepartmentsState[]>) => {
        setDepartments(
          res.data.map((item: DepartmentsState) => ({
            id: item.departmentId,
            department: item.department,
            costCenter: item.costCenter,
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
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const deletDepartment = () => {
    // eslint-disable-next-line
    jwtInterceoptor
      .delete(
        `api/DepartmentMaster/DeleteDepartmentMaster?DepartmentId=${DeleteDepartmentMaster.id}`
      )
      .then(() => {
        showMessage('Department Information Deleted Successfully', 'success');
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
      .finally(() => {
        setDeleteDepartmentMaster({ open: false, id: null });
        getDepartments();
      });
  }

  const updateDepartment = (data: Departments) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/DepartmentMaster/UpdateDepartmentMaster', {
        departmentId: data.id,
        department: data.department,
        costCenter: data.costCenter,
      })
      .then(() => {
        showMessage('Department Information Updated Successfully', 'success');
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
      .finally(() => {
        getDepartments();
      });
  }

  const addDepartment = (data: Departments) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/DepartmentMaster/CreateDepartmentMaster', {
        department: data.department,
        costCenter: data.costCenter,
      })
      .then(() => {
        showMessage('Department record added successfully', 'success');
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
      .finally(() => {
        getDepartments();
      });
  }

  const onEdit = (id: number) => {
    setNewDapartment({ open: true, id });
  };

  const onDelete = (id: number) => {
    setDeleteDepartmentMaster({ open: true, id });
  };

  return (
    <>

      <Typography sx={{

      }}>{t("List the department in your organization")}</Typography>

      <Button
        sx={{

          padding: 0,
          textTransform: "capitalize",
          background: "transparent",
          my: 1
        }}
        onClick={() => { setNewDapartment({
          open: true,
          id: null,
        })}}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px !important',  // Ensuring the width with !important
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
            fontWeight: '500'
          }}
        >
          {t("Add department")}
        </Typography>
      </Button>

      <EnhancedTable
        head={[
          {
            id: 'department',
            label: 'Department',
          },
          {
            id: 'costCenter',
            label: 'Cost Center',
          },
          {
            id: 'action',
            label: 'Actions',
          },
        ]}
        rows={departments.map((department: Departments) =>
          createData2(
            department.department,
            department.costCenter,
            onEdit,
            onDelete,
            department.id ?? 0
          )
        )}
        // isAddable={true}
        sx={{
          minWidth: '100%',
        }}
        loading={loading}
        onAddClick={() => {
          setNewDapartment({
            open: true,
            id: null,
          })
        }}
      />
      <AddNewDepartment
        open={newDapartment.open}
        handleClose={() => { setNewDapartment({ open: false, id: null }) }}
        handleSave={newDapartment.id ? updateDepartment : addDepartment}
        department={
          departments.find((item: Departments) => item.id === newDapartment.id) ?? { department: '', costCenter: '', id: null }
        }
        title={
          newDapartment.id
            ? 'Update Department information'
            : 'Settings - Department'
        }
      />
      <DeleteModal
        message={'Are you sure you want to delete this department?'}
        title={'Delete Department'}
        onCancel={() => { setDeleteDepartmentMaster({ open: false, id: null }) }}
        onConfirm={() => { deletDepartment() }}
        open={DeleteDepartmentMaster.open}
      />
    </>
  );
};

export default DepartmentsTable;
