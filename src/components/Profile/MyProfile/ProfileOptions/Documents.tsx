import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import EnhancedTable from '../../../Global/Table';
import DocIcon from '@mui/icons-material/InsertDriveFile';
import PDFIcon from '@mui/icons-material/Description';
import FileIcon from '@mui/icons-material/AttachFile';
import BaseModal from '../../../Global/Modal';
import DragAndDrop from '../../../Global/DragAndDrop';
import jwtInterceptor from '../../../../services/interceptors';
import { useSnackbar } from '../../../Global/WithSnackbar';
import { useTranslation } from 'react-i18next';
import BinIcon from '../../../Icon/BinIcon';
import DownloadIcon from '../../../Icon/DownloadIcon';
import EditAndSave from '../../../Global/EditAndSave';
import ViewIcon from '../../../Icon/ViewIcon';
const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL + '/api/';
// const email = sessionStorage.getItem('email_key');
// const bearerToken = sessionStorage.getItem('token_key');

const headCells = [
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'type',
    label: 'Type',
  },
  {
    id: 'modified_by',
    label: 'Modified By',
  },
  {
    id: 'modified',
    label: 'Modified',
  },

  {
    id: 'action',
    label: 'Action',
  },
];

function createData(
  title: any,
  type: any,
  modified: any,
  modified_by: any,
  action: any
) {
  return {
    title,
    type,
    modified,
    modified_by,
    action,
  };
}

function CellAction({ id, name, onDelete, onView, token }: any) {
  return (
    <Box className='action-icon-rounded'>
      <Button
          onClick={() => onView(id)}
        >
          <ViewIcon />
        </Button>
      <Button
        onClick={() => {
          handleDownload(id, name, token);
        }}
      >
        <DownloadIcon />
      </Button>

      <Button
        onClick={() => {
          onDelete(id);
        }}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

const DocumentIcon: any = {
  Document: <DocIcon />,
  PDF: <PDFIcon />,
  File: <FileIcon />,
};

const handleDownload = (id: any, filename: any, bearerToken: any) => {
  let url = API_URL + 'EmployeeDocuments/DownloadDocument/' + id;
  console.log(url);
  void fetch(url, {
    method: 'Get',
    headers: new Headers({
      Authorization: 'Bearer ' + bearerToken,
    }),
  })
    .then((response) => response.blob())
    .then((response) => {
      // create "a" HTML element with href to file & click
      const href = URL.createObjectURL(response);
      //console.log(href);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};

function DocumentType({ type }: any) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',

        svg: {
          width: '13px',
          fill: '#18A0FB',
        },
      }}
    >
      {DocumentIcon[type]}
      {t(type)}
    </Box>
  );
}

function Documents({ modal = false }: any) {
  const [open, setOpen] = useState<any>(false);
  const [formData, setformdatastate] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(false);
  const [selecteddocument, setSelecteddocument] = useState<any>(0);
  const initialized = useRef(false);
  const [loading, setLoading] = useState<any>(false);
  const [uploadLoading, setUploadLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [edit, setEdit] = useState<boolean>(false);
  const [fileAdded, setFileAdded] = useState<any>(false);
  const [pdfUrl, setPdfUrl] = useState<any>(null);
  const [viewModal, setViewModal] = useState(false);

  const [employeeDocuments, setEmployeeDocumentState] = useState<any>([]);
  const tblRows: any = [];

  const bearerToken = sessionStorage.getItem('token_key');
  const empId: any = sessionStorage.getItem('employee_id_key') ? sessionStorage.getItem('employee_id_key') : sessionStorage.getItem('empId_key');
  const base_url = process.env.REACT_APP_BASE_URL;
  console.log(edit)

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        void GetDocumentListData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFileInformation = (files: any) => {
    const formDataFiles = new FormData();
    for (const file of files) {
      formDataFiles.append('files', file);
      formDataFiles.append('name', file.name);
    }
    setformdatastate(formDataFiles);
  };

  const GetDocumentListData = async () => {
    setLoading(true);

    jwtInterceptor
      .get('api/EmployeeDocuments/GetDocumentList?EmployeeDetailId=' + empId)
      .then((response: any) => {
        for (var x of response.data) {
          const formattedDate = new Date(x.modifiedDate).toLocaleDateString(
            'en-US',
            {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }
          );
          tblRows.push(
            createData(
              x.fileName,
              <DocumentType type={x.fileType} />,
              x.modifiedBy,
              formattedDate,
              <CellAction
                id={x.employeeDocumentId}
                token={bearerToken}
                name={x.fileName}
                onView={(id: any) => {
                  setViewModal(true);
                  if (id) {
                    const url = API_URL + 'EmployeeDocuments/DownloadDocument/' + id;
                    jwtInterceptor
                      .get(url, { responseType: 'blob' })
                      .then((response: any) => {
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const objectUrl = URL.createObjectURL(blob) + "#toolbar=0";
                        setPdfUrl(objectUrl);
                      });
                  }
                }}
                onDelete={(id: any) => {
                  setSelecteddocument(id);
                  setDeleteModal(true);
                }}
              />
            )
          );
        }
        setEmployeeDocumentState(tblRows);
      })
      .finally(() => setLoading(false));
  };
  const UploadDocuments_Click = () => {
    setUploadLoading(true);
    uploadDocumentsData();
  };
  const uploadDocumentsData = async () => {
    let url =
      'api/EmployeeDocuments/UploadEmployeeDocument?EmployeeDetailId=' + empId;
    /* let response = await profileService.uploadDocumentsDataRequest(
      url,
      formData,
      bearerToken
    );*/

    jwtInterceptor.post(url, formData).then((response: any) => {
      showMessage(response.data, 'success');
      setUploadLoading(false);
      setOpen(false);
      GetDocumentListData();
    });
  };
  const handleDelete = async () => {
    let url =
      'api/EmployeeDocuments/DeleteDocument?employeeDocumentId=' +
      selecteddocument;
    //let response = await profileService.deleteDocumentRequest(url, bearerToken);

    jwtInterceptor.delete(url).then((response: any) => {
      showMessage(response.data, 'success');
      GetDocumentListData();
      setDeleteModal(false);
    });
  };

  // const downloadDocument = async (documentName: any) => {
  //   let url = 'api/EmployeeDocuments/DownloadDocument/' + documentName;
  //   /*let response = await profileService.downloadDocumentRequest(
  //     url,
  //     bearerToken
  //   );*/
  //   jwtInterceptor.get(url).then((response: any) => {
  //     showMessage(response.data, 'success');
  //   });
  // };

  const { t } = useTranslation();

  return (
    <>
      {modal && <EditAndSave
        edit={true}
        setEdit={setEdit}
        onUpdate={() => { UploadDocuments_Click(); setFileAdded(false); setformdatastate(null); }}
        onCancel={() => { setFileAdded(false); setformdatastate(null); }}
        modal={modal}
        title='Documents'
        fileAdded={fileAdded}
      />}
      <EnhancedTable
        title='Documents'
        head={headCells}
        rows={employeeDocuments}
        {...(modal ? {} : { isAddable: true })}
        onAddClick={() => setOpen(true)}
        loading={loading}
        btnTitle='Attachment'
        setFileInformation={setFileInformation}
        modal={modal}
        setFileAdded={setFileAdded}
        fileAdded={fileAdded}
        uploadLoading={uploadLoading}
      />
      <BaseModal
        open={open}
        handleClose={() => setOpen(false)}
        onSave={() => UploadDocuments_Click()}
        title='My Portal - Upload New Document'
        uploadLoading={uploadLoading}
      >
        <Grid container spacing='20px' px='10%'>
          <Grid item xs={12}>
            <Typography className='SmallBody'>{t('Attachment')}</Typography>

            {uploadLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                <CircularProgress />
              </Box>) : (
              <DragAndDrop
                edit={true}
                allowMultiple
                onChangeFile={(e: any) => setFileInformation(e.target.files)}
              />
            )}
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={deleteModal}
        handleClose={() => setDeleteModal((pre: any) => !pre)}
        title='Delete Document'
        yesOrNo={true}
        onSave={() => handleDelete()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              {t('Do you want to delete the selected document ?')}
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={viewModal}
        handleClose={() => { setViewModal((prev) => !prev); setPdfUrl(null); }}
        title='Document - Preview'
        showSaveButton={false}
      >
        <Grid container justifyContent='center' mt={2} minHeight='50px'>
          {pdfUrl ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="700px"
            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </BaseModal>
    </>
  );
}

export default Documents;
