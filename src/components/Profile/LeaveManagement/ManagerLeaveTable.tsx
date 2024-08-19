/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react';
import { CircularChip } from '../../Global/Chips';
import EnhancedTable from '../../Global/Table';
import { Box, Button, alpha } from '@mui/material';
import { CrossIcon, TickIcon } from '../../../assets/images';
import { jwtLeave } from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import LeaveManagementModal1 from './LeaveManagementModal1';
import { Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const headCells = [
  {
    label: 'First Name',
    id: 'first_name',
  },
  {
    label: 'Last Name',
    id: 'last_name',
  },
  {
    label: 'Leave',
    id: 'leave',
  },
  {
    label: 'Start Date',
    id: 'start_date',
  },
  {
    label: 'End Date',
    id: 'end_date',
  },
  {
    label: 'Applied leaves',
    id: 'applied_leaves',
  },
  {
    label: 'Comments',
    id: 'comments',
  },
  {
    label: 'Status',
    id: 'status',
  },
  {
    label: 'Actions',
    id: 'actions',
  },
];

function createData(
  first_name: any,
  last_name: any,
  leave: any,
  start_date: any,
  end_date: any,
  applied_leaves: any,
  comments: any,
  status: any,
  actions: any
) {
  return {
    first_name,
    last_name,
    leave,
    start_date,
    end_date,
    applied_leaves,
    comments,
    status,
    actions,
  };
}

function CellAction({
  id,
  status,
  onApprove,
  onReject,
  showApproveOrReject = true,
}: any) {
  return (
    <Box
      className='action-icon-rounded'
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      {showApproveOrReject && (
        <>
          {(status == 'Rejected' || status == 'Pending') && (
            <Button
              sx={{
                backgroundColor: alpha('#03B525', 0.1),

                svg: {
                  fill: '#03B525',
                },
              }}
              title='Approve'
              name={id}
              onClick={() => onApprove()}
            >
              <TickIcon />
            </Button>
          )}

          {(status == 'Approved' || status == 'Pending') && (
            <Button
              sx={{
                backgroundColor: alpha('#FA3E3E', 0.1),

                svg: {
                  fill: '#FA3E3E',
                },
              }}
              name={id}
              title='Reject'
              onClick={() => onReject()}
            >
              <CrossIcon />
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

function ManagerLeaveTable() {
  let tblRows = [];
  const initialized = useRef(false);
  const [managerLeavesData, setManagerleavesDataState] = useState<any>([]);
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [isLeaveManagementModalOpen, setIsLeaveManagementModalOpen] =
    useState<any>(false);
  const [LeaveDetailIdForPopup, setLeaveDetailIdForPopup] = useState<any>(null);

  const [leaveStatusForPopup, setLeaveStatusForPopup] = useState<any>('');

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      GetLeavesListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetLeavesListData = () => {
    setLoading(true);
    let url = 'api/LeaveManager/GetLeaveListByManagerId?LineManagerId=' + empId;

    jwtLeave
      .get(url)
      .then((response) => {
        tblRows = [];
        for (var x of response.data) {
          let leaveId = x.leaveDetailId;
          let statuscolor =
            x.leaveStatus === 'Approved' ? '#27AE60' : '#EB5757';
          let status =
            x.leaveStatus === 'Approved' || x.leaveStatus === 'Rejected'
              ? false
              : true;
          tblRows.push(
            createData(
              x.firstName,
              x.lastName,
              x.leaveType,
              new Date(x.startDate).toLocaleDateString('en-GB'),
              new Date(x.endDate).toLocaleDateString('en-GB'),
              <CircularChip value={x.totalDays} color='#964CF5' />,
              x.employeeComments,
              <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
                <CircleIcon color={x.leaveStatus === 'Approved' ? "success" : x.leaveStatus === 'Rejected' ? "error" : "warning"} fontSize="inherit" />
                <Typography sx={{ fontSize: 12 }}>{x.leaveStatus}</Typography>
              </Stack>,
              <CellAction
                id={x.leaveId}
                status={x.leaveStatus}
                // leaveDetailId={x.leaveId}
                onApprove={() => {
                  approve('Approved', leaveId);
                }}
                onReject={() => {
                  approve('Rejected', leaveId);
                }}
              />
            )
          );
        }
        setManagerleavesDataState(tblRows);
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const approve = async (status: any, leaveId: any) => {
    await setLeaveStatusForPopup(status);
    setIsLeaveManagementModalOpen(true);
    setLeaveDetailIdForPopup(leaveId);
  };

  const approveOrReject = async (
    status: any,
    leaveId: any,
    managerComment1: any
  ) => {
    let item = {
      leaveDetailId: leaveId,
      managerComment: managerComment1,
      leaveStatus: status,
    };
    let url = 'api/LeaveManager/LeaveApproveReject';

    jwtLeave
      .post(url, item)
      .then((res) => {
        setManagerleavesDataState([]);
        GetLeavesListData();
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      });
  };

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={managerLeavesData}
        loading={loading}
      />

      {/* <LeaveManagementModal
        open={open}
        title="Leave Management - Manager approval"
        handleClose={() => setOpen((pre) => !pre)}
      /> */}
      {isLeaveManagementModalOpen && (
        <LeaveManagementModal1
          open={isLeaveManagementModalOpen}
          handleClose={() => setIsLeaveManagementModalOpen(false)}
          title='Leave Management - Manager approval'
          leaveDetailId={LeaveDetailIdForPopup}
          selectedStatus1={leaveStatusForPopup}
          onSave={(
            status: any,
            LeaveDetailIdForPopup: any,
            managerComment: any
          ) => approveOrReject(status, LeaveDetailIdForPopup, managerComment)}
        />
      )}
    </>
  );
}

export default ManagerLeaveTable;
