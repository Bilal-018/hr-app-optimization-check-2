/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Add } from '@mui/icons-material';
import { Button, CircularProgress, Grid, Stack, Checkbox, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactDOMServer from 'react-dom/server';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '../../assets/images/Search.svg';
import EmployeeInfoModal from '../Global/EmployeeInfoModal';
import DragAndDrop from './DragAndDrop';
import CircleIcon from "@mui/icons-material/Circle";

function descendingComparator(a: any, b: any, orderBy: any) {
  let aValue = a[orderBy];
  let bValue = b[orderBy];

  try {
    if (typeof aValue !== 'string' && typeof aValue !== 'number') {
      const aString = ReactDOMServer.renderToString(aValue);
      aValue = extractValueFromRenderedString(aString); // extractValue is your method to get value from string
    }

    if (typeof bValue !== 'string' && typeof bValue !== 'number') {
      const bString = ReactDOMServer.renderToString(bValue);
      bValue = extractValueFromRenderedString(bString);
    }
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  } catch (error) {
    return 0;
  }
}

function extractValueFromRenderedString(renderedString: any) {
  const regex = />([^<]+)</;
  const match = renderedString.match(regex);
  const retVal = match ? match[1].trim() : null;

  return retVal;
}

function getComparator(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array: any, comparator: any) {
  const stabilizedThis = array?.map((el: any, index: any) => [el, index]);
  stabilizedThis?.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el: any) => el[0]);
}

function EnhancedTableHead(props: any) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property);
  };
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell: any) => (
          <TableCell
            key={headCell?.id}
            align={
              headCell?.label === 'Action' || headCell?.label === 'Actions' || headCell?.label === 'No. of Days'
                ? 'center'
                : 'left'
            }
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: 'gray',
            }}
            sortDirection={orderBy === headCell?.id ? order : false}
          >
            {headCell?.label === 'Action' || headCell?.label === 'Actions' ? (
              t(headCell?.label) // Directly display the label if it's "Action"
            ) : (
              <TableSortLabel
                active={orderBy === headCell?.id}
                direction={orderBy === headCell?.id ? order : 'asc'}
                onClick={createSortHandler(headCell?.id)}
              >
                {t(headCell?.label)}
                {orderBy === headCell?.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? t('sorted descending')
                      : t('sorted ascending')}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// EnhancedTableHead?.propTypes = {
//   numSelected: PropTypes?.number?.isRequired,
//   onRequestSort: PropTypes?.func?.isRequired,
//   onSelectAllClick: PropTypes?.func?.isRequired,
//   order: PropTypes?.oneOf(['asc', 'desc'])?.isRequired,
//   orderBy: PropTypes?.string?.isRequired,
//   rowCount: PropTypes?.number?.isRequired,
//   title: PropTypes?.string,
// };

// Updated proptypes
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes?.number?.isRequired,
  title: PropTypes?.string, // Added this line to define the 'title' prop
  isAddable: PropTypes?.any?.isRequired,
  onAddClick: PropTypes?.any?.isRequired,
  btnTitle: PropTypes?.string?.isRequired,
  search: PropTypes?.string,
  setSearch: PropTypes?.any,
};

function EnhancedTableToolbar(props: any) {
  const { numSelected, isAddable, onAddClick, title, btnTitle, search, setSearch }: any = props;
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        rowGap: '12px',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme?.palette?.primary?.main,
              theme?.palette?.action?.activatedOpacity
            ),
        }),
      }}
    >
      {title &&
        (numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'
          >
            {numSelected} {t('selected')}
          </Typography>
        ) : (
          <Typography
            // variant='h6'
            id='tableTitle'
            component='div'
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { sm: 'center' },
              rowGap: '12px',
              width: '100%',
              fontSize: { xs: '16px', sm: '20px' },
              fontWeight: { xs: '400', sm: '500' },
              lineHeight: { sm: '22px' }
            }}
          >
            {t(props?.title)}

            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                borderBottom: '1px solid #476179',
                marginRight: { sm: '40px' },
                padding: '10px 0',
              }}
            >
              <img src={SearchIcon} alt='Search Icon' />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type='text'
                placeholder='Search'
                style={{
                  color: '#888888',
                  fontSize: '16px',
                  border: 'none',
                  outline: 'none',
                }}
              />
            </Box>
          </Typography>
        ))}

      {numSelected > 0 && (
        <Tooltip title={t('Delete')}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {isAddable && (
        <Box
          sx={{
            ml: { sm: 'auto' },
            minWidth: '150px',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <Button
            variant='outlined'
            sx={{
              paddingX: '4',
              paddingY: '10px',
              minWidth: '100px',
              '@media (max-width: 600px)': {
                minWidth: 'auto',
              },
            }}
            onClick={onAddClick}
          >
            {btnTitle == 'Upload' ? (
              <>
                <CloudUploadIcon />
                {t(btnTitle)}
              </>
            ) : btnTitle == 'Add New' || btnTitle == 'Manual Entry' || btnTitle == 'Attachment' || btnTitle == 'New Skill' || btnTitle == 'New Request' ? (
              <>
                <Add />
                {t(btnTitle)}
              </>
            ) : (
              t(btnTitle)
            )}
          </Button>
        </Box>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes?.number?.isRequired,
};

export default function EnhancedTable({
  title,
  navTabs,
  head,
  rows,
  isAddable = false,
  onAddClick,
  sx = {},
  hidePagination = false,
  loading,
  btnTitle,
  modal = false,
  setFileInformation,
  showPreview = false,
  setShowPreview = () => { },
  edit = false,
  isModal = false,
  setEquipData = () => { },
  setFileAdded = () => { },
  fileAdded = true,
  uploadLoading = false,
}: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [order, setOrder] = React.useState<any>('asc');
  const [orderBy, setOrderBy] = React.useState<any>(
    (head && head?.find((item: any) => item?.isDefaultSort)?.id) ||
    (head && head[0]?.id)
  );
  const [selected, setSelected] = React.useState<any>([]);
  const [page, setPage] = React.useState<any>(0);
  const [dense, setDense] = React.useState<any>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(5);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null); // To store data for the modal
  const [dataAction, setDataAction] = React.useState(null);

  const [search, setSearch] = React.useState<any>('');

  const { t } = useTranslation();

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event: any) => {
  //   if (event.target.checked) {
  //     const newSelected = rows.map((n: any, index: any) => {
  //       console.log(n, "adil xxx");
  //     });
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const openModal = (data: any) => {
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
    setShowPreview(false);
    setDataAction(null);
    sessionStorage.removeItem('employee_id_key');
    sessionStorage.removeItem('selected_employee_details');
    resetChecks();
  };

  const isSelected: any = (name: any) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows.filter((row: any) => {
    if (row.searchableText) {
      return row.searchableText?.toLowerCase().includes(search.toLowerCase());
    }
    return true
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, filteredRows, rowsPerPage]
  );

  React.useEffect(() => {
    if (showPreview) {
      openModal(dataAction);
    }
  }, [showPreview])

  const [checks, setChecks] = React.useState(visibleRows.map((row: any) => Object.keys(row).map(() => [false, false, false])));
  const [equipmentData, setEquipmentData] = React.useState<any>([]);
  const [commentValues, setCommentValues] = React.useState<any>(null);

  // const [check, setCheck] = React.useState<any>(null);

  React.useEffect(() => {
    if (visibleRows.length > 0 && edit) {
      const newCheck = visibleRows.flatMap((row: any, index: any) => {
        const status = row?.Status?.props?.children[0]?.props?.checked ? 'Assigned' : row?.Status?.props?.children[1]?.props?.checked ? 'Not Assigned' : row?.Status?.props?.children[2]?.props?.checked ? 'Unknown' : '';
        return [status === 'Assigned', status === 'Not Assigned', status === 'Unknown'];
      });

      const checksInit = visibleRows.map((row: any, index: any) => {
        const startIndex = index * 3;
        return newCheck.slice(startIndex, startIndex + 3);
      });

      visibleRows.map((row: any, index: any) => {
        setEquipmentData((prevData: any) => {
          const newData = [...prevData];
          newData[index] = row?.Status?.props?.children[0]?.props?.checked === true ? { ...newData[index], isAssetAssigned: true } : row?.Status?.props?.children[1]?.props?.checked === true ? { ...newData[index], isAssetAssigned: false } : { ...newData[index] }
          return newData;
        });
      });

      // setCheck(newCheck);
      setChecks(checksInit);
    }
  }, [edit]);

  const resetChecks = () => {
    setChecks(visibleRows.map((row: any) => Object.keys(row).map(() => [false, false, false])));
    // setCheck([]);
  };

  React.useEffect(() => {
    if (visibleRows.length > 0 && title === 'Asset information') {
      setCommentValues(visibleRows.map((row: any) => row.Comment || ''));
      setEquipmentData(
        visibleRows.map((row: any, index: any) => ({
          equipment: row.Equipment,
          brand: row.Brand,
          model: row.Model,
          registration: row.Registration,
        }))
      );
    }
  }, [rows]);

  React.useEffect(() => {
    setEquipData(equipmentData)
  }, [equipmentData])

  const handleCommentChange = (index: any, value: any) => {
    setEquipmentData((prevData: any) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], comment: value };
      return newData;
    });
  };

  const handleCheckboxChange = (index: any, value: any, type: any) => {
    setEquipmentData((prevData: any) => {
      const newData = [...prevData];
      const { isAssetAssigned, ...rest } = newData[index];
      newData[index] = { ...rest };
      if (type === 0) {
        newData[index] = value === true ? { ...newData[index], isAssetAssigned: value } : { ...newData[index] }
      } else if (type === 1) {
        newData[index] = value === true ? { ...newData[index], isAssetAssigned: false } : { ...newData[index] }
      } else if (type === 2) {
        newData[index] = { ...newData[index] };
      }
      return newData;
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          boxShadow: 'none',
          background: 'transparent',
          border: 'none',
        }}
      >
        {(isAddable || title) && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            title={t(title)}
            isAddable={isAddable}
            onAddClick={onAddClick}
            btnTitle={btnTitle ? btnTitle : ''}
            search={search}
            setSearch={setSearch}
          />
        )}
        {typeof navTabs === 'function' ? navTabs() : null}
        {isModal && title === 'Asset information' && (
          <Stack direction="row" alignItems="center" justifyContent='flex-end' gap={2} width='76%'>
            <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
              <CircleIcon color={"success"} fontSize="inherit" />
              <Typography sx={{ fontSize: 12 }}>Granted</Typography>
            </Stack >
            <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
              <CircleIcon color={"error"} fontSize="inherit" />
              <Typography sx={{ fontSize: 12 }}>N/A</Typography>
            </Stack >
            <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
              <CircleIcon color={"warning"} fontSize="inherit" />
              <Typography sx={{ fontSize: 12 }}>Returned</Typography>
            </Stack >
          </Stack>
        )}
        <TableContainer>
          <Grid container gap={10}>
            <Grid item xs={12} md={modal ? 8 : 12}>
              <Table
                sx={{ minWidth: 620, ...sx }}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  rowCount={rows.length}
                  headCells={head}
                  order={order}
                  orderBy={orderBy}
                  // onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {visibleRows.length > 0 ? (
                    visibleRows.map((row: any, index: any) => {
                      const isItemSelected = isSelected(row.name);
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={`${row.name}-${index}`}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          {Object.keys(row).filter(key => key !== 'searchableText').map((key, cIndex) => {
                            if (key === 'Status' && title === 'Asset information' && edit) {
                              return (
                                <TableCell
                                  key={cIndex}
                                  sx={{
                                    fontWeight: '500',
                                    fontSize: 12,
                                    wordWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    maxWidth: 200, // Adjust this value as needed
                                  }}
                                >
                                  <Stack direction="row" alignItems="center" gap={2}>
                                    <Checkbox
                                      checked={checks[index] && checks[index][0]}
                                      onChange={(e) => {
                                        setChecks((prevChecks: any) => {
                                          const newChecks = [...prevChecks];
                                          if (!newChecks[index]) newChecks[index] = [];
                                          newChecks[index][0] = e.target.checked;
                                          newChecks[index][1] = false;
                                          newChecks[index][2] = false;
                                          return newChecks;
                                        });
                                        handleCheckboxChange(index, e.target.checked, 0);
                                      }}
                                      color='success'
                                      sx={{
                                        '&.MuiCheckbox-root': {
                                          p: 0
                                        },
                                        "& .MuiSvgIcon-root": {
                                          fill: (theme) => theme.palette.success.main,
                                        },
                                      }} />
                                    <Checkbox
                                      checked={checks[index] && checks[index][1]}
                                      onChange={(e) => {
                                        setChecks((prevChecks: any) => {
                                          const newChecks = [...prevChecks];
                                          if (!newChecks[index]) newChecks[index] = [];
                                          newChecks[index][1] = e.target.checked;
                                          newChecks[index][0] = false;
                                          newChecks[index][2] = false;
                                          return newChecks;
                                        });
                                        handleCheckboxChange(index, e.target.checked, 1);
                                      }}
                                      color='error' sx={{
                                        '&.MuiCheckbox-root': {
                                          p: 0
                                        },
                                        "& .MuiSvgIcon-root": {
                                          fill: (theme) => theme.palette.error.main,
                                        },
                                      }} />
                                    <Checkbox color='warning'
                                      checked={checks[index] && checks[index][2]}
                                      onChange={(e) => {
                                        setChecks((prevChecks: any) => {
                                          const newChecks = [...prevChecks];
                                          if (!newChecks[index]) newChecks[index] = [];
                                          newChecks[index][2] = e.target.checked;
                                          newChecks[index][0] = false;
                                          newChecks[index][1] = false;
                                          return newChecks;
                                        });
                                        handleCheckboxChange(index, e.target.checked, 2);
                                      }}
                                      sx={{
                                        '&.MuiCheckbox-root': {
                                          p: 0
                                        },
                                        "& .MuiSvgIcon-root": {
                                          fill: (theme) => theme.palette.warning.main,
                                        },
                                      }} />
                                  </Stack>
                                </TableCell>
                              )
                            } else if (key === 'Comment' && title === 'Asset information' && edit) {
                              return (
                                <TableCell
                                  key={cIndex}
                                  sx={{
                                    fontWeight: '500',
                                    fontSize: 12,
                                    wordWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    maxWidth: 200, // Adjust this value as needed
                                  }}
                                >
                                  <TextField
                                    value={commentValues[index]}
                                    onChange={(e) => {
                                      setCommentValues((prevValues: any) => {
                                        const newValues = [...prevValues];
                                        newValues[index] = e.target.value;
                                        return newValues;
                                      });
                                      handleCommentChange(index, e.target.value);
                                    }}
                                    size="small"
                                    variant="standard"
                                  />
                                </TableCell>
                              )
                            } else {
                              return (
                                <TableCell
                                  key={cIndex}
                                  onClick={() => {
                                    if (key === 'fullName' && title === 'Employees information') {
                                      openModal(row);
                                    } else if (key === 'Action') {
                                      setDataAction(row);
                                    }
                                  }}
                                  sx={{
                                    fontWeight: '500',
                                    fontSize: 12,
                                    wordWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    maxWidth: 200, // Adjust this value as needed
                                  }}
                                  align={key === 'action' ? 'center' : 'left'}
                                >
                                  {row[key]}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={head?.length} align='center'>
                        {loading ? <CircularProgress /> : t('No data found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>

            {modal && <Grid item xs={12} md={3}>
              <Typography className='SmallBody'>{t('Attachment')}</Typography>

              {uploadLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                  <CircularProgress />
                </Box>) : (
                <DragAndDrop
                  edit={true}
                  allowMultiple
                  onChangeFile={(e: any) => { setFileInformation(e.target.files); setFileAdded(true); }}
                  fileAdded={fileAdded}
                />
              )}
            </Grid>}
          </Grid>
        </TableContainer>
        {!hidePagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      <EmployeeInfoModal
        open={modalOpen}
        onClose={closeModal}
        employeeData={modalData}
      />
    </Box>
  );
}
