import React from 'react';
import BaseModal from '../../Global/Modal';
import Documents from '../../Profile/MyProfile/ProfileOptions/Documents';

// interface ViewDocModalProps {
//   open: boolean;
//   handleClose: () => void;
//   title: string;
//   onSave: () => void;
//   selectedId: string; // Assuming selectedId is of type string
// }

const ViewDocModal: React.FC<any> = ({
  open,
  handleClose,
  title,
  onSave,
  selectedId,
}) => {
  return (
    <BaseModal
      open={open}
      handleClose={handleClose}
      title={title}
      onSave={onSave}
      sx={{
        maxWidth: 'fit-content',
      }}
      showSaveButton={false}
    >
      {selectedId && <Documents employeeId={selectedId} />}
    </BaseModal>
  );
};

export default ViewDocModal;
