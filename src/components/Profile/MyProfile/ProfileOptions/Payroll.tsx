import React from 'react';
import EnhancedTable from '../../../Global/Table';
import { Box, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const headCells = [
  {
    id: 'title',
    numeric: false,
    label: 'Title',
  },
  {
    id: 'month',
    numeric: true,
    label: 'Month',
  },
  {
    id: 'year',
    numeric: true,
    label: 'Year',
  },
  {
    id: 'modified',
    numeric: false,
    label: 'Modified',
  },
  {
    id: 'modified_by',
    numeric: false,
    label: 'Modified By',
  },
  {
    id: 'action',
    numeric: false,
    label: 'Action',
  },
];

function createData(
  title: any,
  month: any,
  year: any,
  modified: any,
  modified_by: any,
  action: any
) {
  return {
    title,
    month,
    year,
    modified,
    modified_by,
    action,
  };
}

function CellAction() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <Button
        sx={{
          width: '30px',
          height: '30px',
          minWidth: '30px',
          minHeight: '30px',
          borderRadius: '50%',
          backgroundColor: '#18a0fb14',

          svg: {
            width: '18px',
            height: '18px',
          },
        }}
      >
        <ShareIcon />
      </Button>
      <Button
        sx={{
          width: '30px',
          height: '30px',
          minWidth: '30px',
          minHeight: '30px',
          borderRadius: '50%',
          backgroundColor: '#df6f7813',

          svg: {
            width: '18px',
            height: '18px',
          },
        }}
      >
        <CloudDownloadIcon color='error' />
      </Button>
      <MoreVertIcon />
    </Box>
  );
}

const rows = [
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
  createData(
    'January Payslip',
    'January',
    '2021',
    '01/01/2021',
    'John Doe',
    <CellAction />
  ),
];

function Payroll() {
  return (
    <>
      <EnhancedTable title='Payslips' head={headCells} rows={rows} />
    </>
  );
}

export default Payroll;
