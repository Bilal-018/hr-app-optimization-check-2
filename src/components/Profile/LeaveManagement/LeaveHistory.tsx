import React, { useState, useRef, useEffect } from 'react';
import BaseModal from '../../Global/Modal';
import EnhancedTable from '../../Global/Table';
import { jwtLeave } from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import { Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const headCells = [
  // {
  //   id: 'leave_type',
  //   label: 'Leave Type',
  // },
  {
    id: 'start_date',
    label: 'Starting Date',
  },
  {
    id: 'end_date',
    label: 'End Date',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'applied_leaves',
    label: 'No. of Days',
  },

  // {
  //   id: 'comments',
  //   label: 'Comments',
  // },
];

function createData(
  // leave_type: any,
  start_date: any,
  end_date: any,
  status: any,
  applied_leaves: any,
  // comment: any
) {
  return {
    // leave_type,
    start_date,
    end_date,
    status,
    applied_leaves,
    // comment,
  };
}

function LeaveHistory({ handleClose, open, leaveData }: any) {
  const [leavesHistoryData, setleavesHistoryDataState] = useState<any>([]);
  const initialized = useRef(false);
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');

  const GetLeavesHistoryListData = () => {
    setLoading(true);
    let url =
      'api/EmployeeLeave/GetEmployeeLeaveListByLeaveType?EmployeeDetailId=' +
      empId +
      '&LeaveTypeId=' +
      leaveData;

    jwtLeave
      .get(url)
      .then((response) => {
        let tblRows = [];
        initialized.current = false;
        for (var x of response.data) {
          tblRows.push(
            createData(
              // x.leaveType,
              new Date(x.startDate).toLocaleDateString('en-GB'),
              new Date(x.endDate).toLocaleDateString('en-GB'),
              <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
                <CircleIcon color={x.leaveStatus === 'Approved' ? "success" : x.leaveStatus === 'Rejected' ? "error" : "warning"} fontSize="inherit" />
                <Typography sx={{ fontSize: 12 }}>{x.leaveStatus}</Typography>
              </Stack>,
              <Typography textAlign='center' sx={{ fontSize:'24px', fontWeight:'600', color:'#E2B93B', ml:'-20%' }}>
                {x.totalDays}
              </Typography>,
              // x.managerComment
            )
          );
        }
        setleavesHistoryDataState(tblRows);
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => { setLoading(false) });
  };

  useEffect(() => {
    if (bearerToken && open) {
      initialized.current = true;
      setleavesHistoryDataState([]);
      GetLeavesHistoryListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <BaseModal
      handleClose={() => {
        handleClose();
        setleavesHistoryDataState([]);
      }}
      open={open}
      title='Leave History'
      showSaveButton={false}
      sx={{
        maxWidth: 'fit-content',
      }}
    >
      <EnhancedTable
        head={headCells}
        rows={leavesHistoryData}
        loading={loading}
      />
    </BaseModal>
  );
}

export default LeaveHistory;
