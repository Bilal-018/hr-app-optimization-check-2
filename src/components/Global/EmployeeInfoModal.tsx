import React from "react";
import { Modal, Box, Button } from "@mui/material";
import HRIndex from "../Profile/MyProfile/ProfileOptions/HRIndex";
import HRProfileInfo from "../Profile/MyProfile/HRProfileInfo";
import CloseIcon from '@mui/icons-material/Close';

interface EmployeeInfoModalProps {
  open: boolean;
  onClose: () => void;
  employeeData: any;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  px: 2,
  borderRadius: '20px'
  // overflowY: "auto",
  // height: "85vh",
};

const EmployeeInfoModal: React.FC<EmployeeInfoModalProps> = ({ open, onClose, employeeData }) => {
  if (!employeeData) {
    return null;
  }
  sessionStorage.setItem(
    'employee_id_key',
    employeeData.employeeId?.replace(/^.*-/g, "")
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={{ overflowY: "auto", height: "85vh", py: 4, px: 2 }}>
          <Box
            className='action-icon-rounded'
            sx={{
              svg: {
                fill: (theme) => theme.palette.info.main,
              },
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={onClose} sx={{
              background: (theme) => theme.palette.grey[200]
            }}>
              <CloseIcon />
            </Button>
          </Box>
          <HRProfileInfo />
          <HRIndex />
        </Box>
      </Box>
    </Modal>
  );
};

export default EmployeeInfoModal;
