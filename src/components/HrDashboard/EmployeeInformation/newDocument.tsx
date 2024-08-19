import React from 'react';
import BaseModal from '../../Global/Modal';
import DragAndDrop from '../../Global/DragAndDrop';

interface NewDocumentProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  onSave: () => void;
  setformdatastate: React.Dispatch<React.SetStateAction<FormData>>;
}

const NewDocument: React.FC<NewDocumentProps> = ({
  open,
  handleClose,
  title,
  onSave,
  setformdatastate,
}) => {
  const setUploadFiles = (e: FileList | null) => {
    if (e) {
      const formDataFiles = new FormData();
      for (let i = 0; i < e.length; i++) {
        formDataFiles.append('files', e[i]);
        formDataFiles.append('name', e[i].name);
      }
      setformdatastate(formDataFiles);
    }
  };

  return (
    <BaseModal
      open={open}
      handleClose={handleClose}
      title={title}
      onSave={onSave}
    >
      <DragAndDrop
        edit={true}
        allowMultiple
        onChangeFile={(e: any) => {
          setUploadFiles(e.target.files);
        }}
      />
    </BaseModal>
  );
};

export default NewDocument;
