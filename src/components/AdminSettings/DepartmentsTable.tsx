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

function createData2(
  department: any,
  costCenter: any,
  onEdit: any,
  onDelete: any,
  id: any
) {
  return {
    department,
    costCenter,
    Action: <CellAction onEdit={onEdit} onDelete={onDelete} id={id} />,
  };
}
const noop = () => { /* do nothing */ };
function CellAction({ onEdit = noop, onDelete = noop, id }: any) {
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

const DepartmentsTable: React.FC = () => {
  const [newDapartment, setNewDapartment] = useState<any>({
    open: false,
    id: null,
  });
  const [DeleteDepartmentMaster, setDeleteDepartmentMaster] = useState<any>({
    open: false,
    id: null,
  });

  const [departments, setDepartments] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();

  const getDepartments = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/DepartmentMaster/GetAllDepartmentMasterList')
      .then((res: any) => {
        setDepartments(
          res.data.map((item: any) => ({
            id: item.departmentId,
            department: item.department,
            costCenter: item.costCenter,
          }))
        );
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => { setLoading(false) });
  };

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletDepartment = () =>
    jwtInterceoptor
      .delete(
        `api/DepartmentMaster/DeleteDepartmentMaster?DepartmentId=${DeleteDepartmentMaster.id}`
      )
      .then(() => {
        showMessage('Department Information Deleted Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => {
        setDeleteDepartmentMaster({ open: false, id: null });
        getDepartments();
      });

  const updateDepartment = (data: any) =>
    jwtInterceoptor
      .post('api/DepartmentMaster/UpdateDepartmentMaster', {
        departmentId: data.id,
        department: data.department,
        costCenter: data.costCenter,
      })
      .then(() => {
        showMessage('Department Information Updated Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => {
        getDepartments();
      });

  const addDepartment = (data: any) =>
    jwtInterceoptor
      .post('api/DepartmentMaster/CreateDepartmentMaster', {
        department: data.department,
        costCenter: data.costCenter,
      })
      .then(() => {
        showMessage('Department record added successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => {
        getDepartments();
      });

  const onEdit = (id: any) => {
    setNewDapartment({ open: true, id });
  };

  const onDelete = (id: any) => {
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
        onClick={() => setNewDapartment({
          open: true,
          id: null,
        })}
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
        rows={departments.map((department: any) =>
          createData2(
            department.department,
            department.costCenter,
            onEdit,
            onDelete,
            department.id
          )
        )}
        // isAddable={true}
        sx={{
          minWidth: '100%',
        }}
        loading={loading}
        onAddClick={() =>
          setNewDapartment({
            open: true,
            id: null,
          })
        }
      />
      <AddNewDepartment
        open={newDapartment.open}
        handleClose={() => setNewDapartment(false)}
        handleSave={newDapartment.id ? updateDepartment : addDepartment}
        department={
          departments.find((item: any) => item.id === newDapartment.id) || {}
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
        onCancel={() => setDeleteDepartmentMaster({ open: false, id: null })}
        onConfirm={() => deletDepartment()}
        open={DeleteDepartmentMaster.open}
      />
    </>
  );
};

export default DepartmentsTable;
