import React, { useState } from 'react';
import EnhancedTable from '../Global/Table';
import { Box, Button, Grid, TextField, Typography, alpha } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BaseModal from '../Global/Modal';
import DeleteModal from '../Global/DeleteModal';
import { useTranslation } from 'react-i18next';

interface RowData {
  employeeId: string;
  fullName: string;
  title: string;
  type: string;
  modified: string;
  modifiedBy: string;
  action: any;
}

const headCells = [
  {
    id: 'employeeId',
    label: 'Employee ID',
  },
  {
    id: 'fullName',
    label: 'Full Name',
  },
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'type',
    label: 'Type',
  },
  {
    id: 'modified',
    label: 'Modified',
  },
  {
    id: 'modifiedBy',
    label: 'Modified By',
  },
  {
    id: 'Action',
    label: 'Action',
  },
];

function createData(
  employeeId: string,
  fullName: string,
  title: string,
  type: string,
  modified: string,
  modifiedBy: string,
  action: any
): RowData {
  return {
    employeeId,
    fullName,
    title,
    type,
    modified,
    modifiedBy,
    action,
  };
}

function CellAction({ onDelete }: { onDelete: () => void }) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        sx={{
          backgroundColor: alpha('#27AE60', 0.1),

          svg: {
            fill: '#27AE60',
          },
        }}
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
      <Button>
        <MoreVertIcon />
      </Button>
    </Box>
  );
}

function EmployeeSkillsTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const rows: RowData[] = [
    createData(
      'EMP - 0025',
      'Steeve Farnandas',
      'Finance Exc.',
      'PDF',
      '09 Sep, 2021',
      'Shahab Bukhari',
      <CellAction onDelete={() => { setDeleteOpen((pre: any) => !pre) }} />
    ),
    // Add more rows as needed
  ];

  const { t } = useTranslation();

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={rows}
        isAddable={true}
        onAddClick={() => { setOpen((pre: boolean) => !pre) }}
        title='Employees information'
      />
      <BaseModal
        open={open}
        handleClose={() => { setOpen((pre: boolean) => !pre) }}
        title='Upload new document'
        onSave={undefined}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography fontSize='Small'>{t('First Name')}</Typography>
            <TextField
              variant='outlined'
              placeholder={t('Enter First Name').toString()}
            />
          </Grid>
          {/* Add more Grid items as needed */}
        </Grid>
      </BaseModal>
      <DeleteModal
        open={deleteOpen}
        onCancel={() => { setDeleteOpen((pre: boolean) => !pre) }}
        onConfirm={() => { setDeleteOpen((pre: boolean) => !pre) }}
        title={'Delete Employee Document'}
        message={'Are you sure you want to delete this document?'}
      />
    </>
  );
}

export default EmployeeSkillsTable;
