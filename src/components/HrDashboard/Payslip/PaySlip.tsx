import React, { useState, useRef, useEffect } from 'react';
import EnhancedTable from '../../Global/Table';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import BaseModal from '../../Global/Modal';
// import ShareIcon from '@mui/icons-material/Share';
import UploadFiles from '../../Upload/upload-files.component';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../../services/interceptors';
import BinIcon from '../../Icon/BinIcon';
import ViewIcon from '../../Icon/ViewIcon';
import DownloadIcon from '../../Icon/DownloadIcon';

// const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL + '/api/';

type StylesWithMediaQuery = Record<string, React.CSSProperties> & {
  '@media (max-width: 850px)': React.CSSProperties;
};

const styles: StylesWithMediaQuery = {
  topContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsContainer: {
    display: 'flex',
    gap: '15px',
  },
  '@media (max-width: 850px)': {
    flexDirection: 'column',
    gap: '15px',
  },
};

interface PayslipData {
  employeeId: string;
  employeeName: string;
  title: string;
  month: string;
  year: string;
  modified: string;
  payslipId: string;
  filepath: string;
}

interface FaultPayslipData {
  employeeId: string;
  filepath: string;
  reason: string;
}

interface TableDataRow {
  employeeId: string;
  employeeFullName?: string;
  // title: string;
  month: string;
  year: string;
  // modified: string;
  Action: JSX.Element;
}

interface TableFaultDataRow {
  employeeId: string;
  fileName: string;
  reason: string;
  Action: JSX.Element;
}

interface EmployeeSkillsTableProps {
  role?: string;
  empid?: any;
}

const EmployeeSkillsTable: React.FC<EmployeeSkillsTableProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [addButton, setAddButton] = useState(true);
  const [shareModal, setShareModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteFaultModal, setDeleteFaultModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<string | null>(null);
  const [payslips, setPayslips] = useState<TableDataRow[]>([]);
  const [faultPayslips, setFaultPayslips] = useState<TableFaultDataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [subMenu, setSubMenu] = useState<'success' | 'failed'>('success');

  const [pdfUrl, setPdfUrl] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [payslipMonth, setPayslipMonth] = useState('');
  const [payslipYear, setPayslipYear] = useState('');

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const initialized = useRef(false);

  // const tblRows: TableDataRow[] = [];

  const handleShare = () => {
    //handle share function code here
    console.log('inside the handleshare function');
  };

  const handleEdit = () => {
    if (selectedPayslip) {
      const url = ''; // Add your edit API URL here
      const payload = {
        title,
        month: payslipMonth,
        year: payslipYear,
      };

      jwtInterceptor.put(url, payload).then(() => {
        fetchPayloads();
      });

      setEditModal(false);
    }
  };

  const handleDelete = () => {
    if (selectedPayslip) {
      const url = `api/Payslip/DeletePayslip?id=${selectedPayslip}`;
      jwtInterceptor.delete(url).then(() => {
        fetchPayloads();
      });
      setDeleteModal(false);
    }
  };

  const handleFaultDelete = () => {
    if (selectedPayslip) {
      const url = `api/Payslip/DeletefaultPayslip?id=${selectedPayslip}`;
      jwtInterceptor.delete(url).then(() => {
        void getFaultPayslips();
      });
      setDeleteFaultModal(false);
    }
  };

  function CellAction({ id, onDelete, onView, onDownload }: any) {
    return (
      <Box className='action-icon-rounded'>
        {/* <Button
          sx={{
            backgroundColor: alpha('#30ABFA', 0.1),
            svg: {
              fill: '#30ABFA',
            },
          }}
          onClick={() => onShare(id)}
        >
          <ShareIcon />
        </Button> */}
        <Button
          onClick={() => onView(id)}
        >
          <ViewIcon />
        </Button>
        {/* <Button
          onClick={() => onEdit(id)}
        >
          <EditIcon />
        </Button> */}
        <Button
          onClick={() => onDelete(id)}
        >
          <BinIcon />
        </Button>
        <Button
          onClick={() => onDownload(id)}
        >
          <DownloadIcon />
        </Button>
        {/* <Button>
          <MoreVertIcon />
        </Button> */}
      </Box>
    );
  }

  function CellActionFault({ id, onDelete }: any) {
    return (
      <Box className='action-icon-rounded'>
        {/* <Button
          sx={{
            backgroundColor: alpha('#30ABFA', 0.1),
            svg: {
              fill: '#30ABFA',
            },
          }}
          onClick={() => onShare(id)}
        >
          <ShareIcon />
        </Button> */}
        <Button
          onClick={() => onDelete(id)}
        >
          <BinIcon />
        </Button>
      </Box>
    );
  }

  function navTabs() {
    return (
      <Box sx={[styles.topContainer, { marginLeft: 2 }]}>
        {props.role === 'admin' && (
          <Box sx={styles.optionsContainer}>
            <Box
              className='c-l'
              sx={{
                cursor: 'pointer',
                display: 'flex',
                // backgroundColor: "black",
                marginX: '10px',
                // borderBottom: "4px solid",

                // borderBottomColor: "#18A0FB",
                flexDirection: 'column', // Ensure items are stacked vertically
                alignItems: 'center', // Center items horizontally
                marginBottom: subMenu !== 'success' ? '9px' : '0px',
                ...(subMenu === 'success' && {
                  color: '#18A0FB',
                }),
              }}
              onClick={() => { setSubMenu('success') }}
            >
              <Typography className='smallBody'>{t('Success')}</Typography>
              {subMenu === 'success' && (
                <Box
                  sx={{
                    width: '130%',
                    height: '2px',
                    backgroundColor: '#18A0FB',
                    marginTop: '3px',
                  }}
                />
              )}
            </Box>
            <Box
              className='c-l'
              sx={() => ({
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column', // Ensure items are stacked vertically
                alignItems: 'center', // Center items horizontally
                marginBottom: subMenu !== 'failed' ? '9px' : '0px',
                ...(subMenu === 'failed' && {
                  color: '#18A0FB',
                }),
              })}
              onClick={() => { setSubMenu('failed') }}
            >
              <Typography className='smallBody'>{t('Failed')}</Typography>
              {subMenu === 'failed' && (
                <Box
                  sx={{
                    width: '130%',
                    height: '2px',
                    backgroundColor: '#18A0FB',
                    marginTop: '3px', // Space between the text and the line
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  const fetchPayloads = () => {
    let url = 'api/Payslip/GetPayslips';
    setLoading(true);

    if (props.empid) {
      setAddButton(false);
      url = `api/Payslip/GetPayslip?id=${props.empid}`;
    }

    jwtInterceptor
      .get(url)
      .then((response: any) => {
        const data: PayslipData[] = response.data;
        const rows: TableDataRow[] = data.map((x: any) => {
          const filename = `${x.employeeId}-${x.month}-${x.year}${x.filepath}`;
          const handleEdit = (id: any) => {
            setSelectedPayslip(id);
            setSelectedItem(x);
            setEditModal(true);
          };

          // Combine all text for searchable text
          const searchableText = [
            x.employeeId,
            x.employeeName,
            x.month,
            x.year,
          ].join(' ');

          return {
            employeeId: x.employeeId,
            employeeFullName: x.employeeName,
            // title: x.title == null ? 'null' : x.title,
            month: x.month,
            year: x.year,
            // modified: x.modified,
            Action: (
              <CellAction
                id={x.payslipId}
                filename={filename}
                onShare={(id: any) => {
                  setSelectedPayslip(id);
                  setShareModal(true);
                }}
                onEdit={handleEdit}
                onDelete={(id: any) => {
                  setSelectedPayslip(id);
                  setDeleteModal(true);
                }}
                onView={(id: any) => {
                  setViewModal(true);
                  if (id) {
                    const url = `api/Payslip/OpenPayslip?id=${id}`;
                    jwtInterceptor
                      .get(url, { responseType: 'blob' })
                      .then((response: any) => {
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const objectUrl = URL.createObjectURL(blob) + "#toolbar=0";
                        setPdfUrl(objectUrl);
                      });
                  }
                }}
                onDownload={(id: any) => {
                  if (id) {
                    const url = `api/Payslip/DownloadPayslip?id=${id}`;
                    jwtInterceptor
                      .get(url, { responseType: 'blob' })
                      .then((response: any) => {
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `payslip_${id}.pdf`;
                        link.click()
                      })
                  }
                }}
              />
            ),
            searchableText,
          };
        });
        setPayslips(rows);
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFaultPayslips = async () => {
    const url = 'api/Payslip/GetFaultPayslips';
    setLoading(true);

    jwtInterceptor
      .get(url)
      .then((response: any) => {
        const data: FaultPayslipData[] = response.data;
        const rows: TableFaultDataRow[] = data.map((x) => {

          // Combine all text for searchable text
          const searchableText = [
            x.employeeId,
            x.filepath,
            x.reason,
          ].join(' ');

          return {
            employeeId: x.employeeId,
            fileName: x.filepath,
            reason: x.reason,
            Action: (
              <CellActionFault
                id={x.employeeId}
                filename={x.filepath}
                onDelete={(id: any) => {
                  setSelectedPayslip(id);
                  setDeleteFaultModal(true);
                }}
                onShare={(id: any) => {
                  setSelectedPayslip(id);
                  setShareModal(true);
                }}
              />
            ),
            searchableText,
          };
        });
        setFaultPayslips(rows);
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchPayloads();
      getFaultPayslips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setTitle(selectedItem.title == null ? '' : selectedItem.title);
      setPayslipMonth(selectedItem.month);
      setPayslipYear(selectedItem.year);
    }
  }, [selectedItem])

  const { t } = useTranslation();

  const headCells = [
    {
      id: 'id',
      label: 'Employee ID',
    },
    {
      id: 'name',
      label: 'Employee Name',
    },
    // {
    //   id: 'title',
    //   label: 'Title',
    // },
    {
      id: 'month',
      label: 'Month',
    },
    {
      id: 'year',
      label: 'Year',
    },
    // {
    //   id: 'modified',
    //   label: 'Modified',
    // },
    {
      id: 'action',
      label: 'Action',
    },
  ];

  const headCellsFault = [
    {
      id: 'id',
      label: 'Employee ID',
    },
    {
      id: 'filepath',
      label: 'Filepath',
    },
    {
      id: 'reason',
      label: 'Reason',
    },
    {
      id: 'action',
      label: 'Action',
    },
  ];

  return (
    <>
      {/* <Box sx={styles.topContainer}>
        {props.role === "admin" && (
          <Box sx={styles.optionsContainer}>
            <Box
              className="c-l"
              sx={(theme: Theme) => ({
                cursor: "pointer",
                display: "flex",
                alignContent: "center",
                ...(subMenu === "success" && SelectCatStyle(theme)),
              })}
              onClick={() => setSubMenu("success")}
            >
              <CheckCircleOutlineIcon />
              <Typography className="smallBody">{t("Succeed")}</Typography>
            </Box>
            <Box
              className="c-l"
              sx={(theme: Theme) => ({
                cursor: "pointer",
                display: "flex",
                alignContent: "center",
                ...(subMenu === "failed" && SelectCatStyle(theme)),
              })}
              onClick={() => setSubMenu("failed")}
            >
              <HighlightOffIcon />
              <Typography className="smallBody">{t("Failed")}</Typography>
            </Box>
          </Box>
        )}
      </Box> */}

      {subMenu === 'success' ? (
        <EnhancedTable
          title='Payslips'
          navTabs={navTabs}
          head={headCells}
          rows={payslips}
          onAddClick={() => setOpen((prev) => !prev)}
          isAddable={addButton}
          loading={loading}
          btnTitle='Upload'
        />
      ) : (
        <EnhancedTable
          title='Payslips'
          navTabs={navTabs}
          head={headCellsFault}
          rows={faultPayslips}
          loading={loading}
          onAddClick={undefined}
        />
      )}
      <BaseModal
        open={open}
        handleClose={() => setOpen((prev) => !prev)}
        title='Payslips'
        showSaveButton={false}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UploadFiles path='Payslip/UploadPayslip' t={t} />
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={shareModal}
        handleClose={() => setShareModal((prev) => !prev)}
        title='Share payslip'
        yesOrNo={true}
        onSave={() => handleShare()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              {t('Do you want to share the selected payslip ?')}
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={editModal}
        handleClose={() => {setEditModal((prev) => !prev); setSelectedItem(null); }}
        title='Update payslip information'
        yesOrNo={false}
        onSave={() => handleEdit()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              <form noValidate autoComplete='off'>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <label htmlFor='title' style={{ fontWeight: '600' }}>
                      Title
                    </label>
                    <TextField
                      fullWidth
                      label='Retitle document'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <label htmlFor='month' style={{ fontWeight: '600' }}>
                      Month
                    </label>
                    <TextField
                      fullWidth
                      label='Modified payslip month'
                      value={payslipMonth}
                      onChange={(e) => setPayslipMonth(e.target.value)}
                      sx={{ mb: 5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <label htmlFor='year' style={{ fontWeight: '600' }}>
                      Year
                    </label>
                    <TextField
                      fullWidth
                      label='Modified payslip year'
                      value={payslipYear}
                      onChange={(e) => setPayslipYear(e.target.value)}
                      sx={{ mb: 5 }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={deleteModal}
        handleClose={() => setDeleteModal((prev) => !prev)}
        title='Delete payslip'
        yesOrNo={true}
        onSave={() => handleDelete()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className='SmallBody'>
              {t('Do you want to delete the selected payslip ?')}
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={deleteFaultModal}
        handleClose={() => setDeleteFaultModal((prev) => !prev)}
        title='Delete payslip'
        yesOrNo={true}
        onSave={() => handleFaultDelete()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontSize='SmallBody'>
              {t('Do you want to delete the selected Faultpayslip ?')}
            </Typography>
          </Grid>
        </Grid>
      </BaseModal>
      <BaseModal
        open={viewModal}
        handleClose={() => { setViewModal((prev) => !prev); setPdfUrl(null); }}
        title='Payslip - Preview'
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
};

export default EmployeeSkillsTable;
