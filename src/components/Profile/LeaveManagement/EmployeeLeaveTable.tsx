import React, { useState, useEffect, useRef } from 'react';
import { CircularChip } from '../../Global/Chips';
import EnhancedTable from '../../Global/Table';
import LeaveRequest from './LeaveRequest';
import LeaveHistory from './LeaveHistory';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../../Global/WithSnackbar';
import { jwtLeave } from '../../../services/interceptors';

const headCells = [
  {
    id: 'leave',
    label: 'Leave Type',
  },
  {
    id: 'entitled_leaves',
    label: 'Entitled leaves',
  },
  {
    id: 'applied_leaves',
    label: 'Leaves applied',
  },
  {
    id: 'approved_leaves',
    label: 'Leaves approved',
  },

  {
    id: 'leaves_pending_approval',
    label: 'Leaves pending for approval',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
];

function createData(
  leave: any,
  entitled_leaves: any,
  applied_leaves: any,
  approved_leaves: any,
  leaves_pending_approval: any,
  balance: any,
  searchableText: string,
) {
  return {
    leave,
    entitled_leaves,
    applied_leaves,
    approved_leaves,
    leaves_pending_approval,
    balance,
    searchableText,
  };
}

function EmployeeLeaveTable() {
  const [open, setopen] = useState<any>(false);
  const tblRows: any = [];
  const initialized = useRef(false);
  const [leavesData, setleavesDataState] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [leaveHistoryModal, setLeaveHistoryModal] = useState<any>(false);
  const [leaveId, setIdState] = useState<any>(null);
  const { showMessage }: any = useSnackbar();

  // const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      GetLeavesListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetLeavesListData = () => {
    setLoading(true);
    let url = 'api/EmployeeLeave/GetLeaveDashboard?EmployeeDetailId=' + empId;
    jwtLeave
      .get(url)
      .then((response) => {
        for (var x of response.data.leaveDashboardDto) {
          let eId = x.leaveTypeId;

          const leaveType = x.leaveType;
          const daysEntitled = x.daysEntitled.toString();
          const appliedLeaves = x.appliedLeaves.toString();
          const approvedLeaves = x.approvedLeaves.toString();
          const pendingLeaves = x?.pendingLeaves?.toString();
          const balance = x?.balance.toString();

          // Combine all text for searchable text
          const searchableText = [
            leaveType,
            daysEntitled,
            appliedLeaves,
            approvedLeaves,
            pendingLeaves,
            balance,
          ].join(' ');

          tblRows.push(
            createData(
              <Link
                to={''}
                color='#18A0FB !important'
                onClick={() => { onHistory(eId) }}
                style={{
                  textDecoration: 'underline',
                  color: '#18A0FB !important',
                }}
              >
                {x.leaveType}
              </Link>,
              <CircularChip value={x.daysEntitled} color='#18A0FB' />,
              <CircularChip value={x.appliedLeaves} color='#964CF5' />,
              <CircularChip value={x.approvedLeaves} color='#03B525' />,
              <CircularChip value={x.pendingLeaves} color='#E2B93B' />,
              <CircularChip value={x.balance} color='#092C4C' />,
              searchableText,
            )
          );
        }
        setleavesDataState(tblRows);
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      })
      .finally(() => { setLoading(false) });
  };

  function onHistory(eId: any) {
    setLeaveHistoryModal((pre: any) => !pre);
    setIdState(eId);
  }
  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={leavesData}
        isAddable={true}
        onAddClick={() => setopen((pre: any) => !pre)}
        loading={loading}
        title={'Employees Leaves'}
        btnTitle={'New Request'}
      />
      <LeaveRequest
        open={open}
        onClose={() => setopen(false)}
        onSave={() => {
          GetLeavesListData();
        }}
      />
      <LeaveHistory
        open={leaveHistoryModal}
        handleClose={() => setLeaveHistoryModal(false)}
        leaveData={leaveId}
      />
    </>
  );
}

export default EmployeeLeaveTable;
