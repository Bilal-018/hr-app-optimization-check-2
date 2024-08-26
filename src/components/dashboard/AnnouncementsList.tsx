import React, { useState, useEffect } from 'react';
import BaseModal from '../Global/Modal';
import EnhancedTable from '../Global/Table';
import { Box, Grid, Switch, TextField, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import DeleteModal from '../Global/DeleteModal';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import CircleIcon from "@mui/icons-material/Circle";
import CalendarIcon from '../Icon/CalenderIcon';
import { Axios, AxiosResponse } from 'axios';

interface Announcement {
  title?: string;
  description?: string;
  expiryDate?: Date;
  isVisibleToUser?: boolean;
  anouncementId?: number;
  startDate?: Date;
}

interface RowData {
  title: string;
  description: string;
  expiryDate: any;
  visible: any;
  action: JSX.Element;
  searchableText: string;
}

const headCells = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'expiryDate', label: 'Expiration date' },
  { id: 'visibleToUser', label: 'Visible to user' },
  { id: 'action', label: 'Action' },
];

function extractTextFromElement(element: React.ReactElement): string {
  if (typeof element.props.children === 'string') {
    return element.props.children;
  }

  if (Array.isArray(element.props.children)) {
    return element.props.children.map((child: any) => 
      React.isValidElement(child) ? extractTextFromElement(child) : child
    ).join(' ');
  }

  if (React.isValidElement(element.props.children)) {
    return extractTextFromElement(element.props.children);
  }

  return '';
}

function createData(
  title: string | undefined,
  description: string | undefined,
  expiryDate: JSX.Element,
  visible: JSX.Element,
  action: JSX.Element,
): RowData {

  const searchableText = [
    title,
    description,
    extractTextFromElement(expiryDate),
    extractTextFromElement(visible),
  ].join(' ');

  if (title === undefined) title = '';
  if (description === undefined) description = '';

  return {
    title,
    description,
    expiryDate,
    visible,
    action,
    searchableText,
  };
}

function CellAction({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}): JSX.Element {
  return (
    <Box className='action-icon-rounded'>
      <Box onClick={onEdit}>
        <EditIcon />
      </Box>
      <Box onClick={onDelete}>
        <BinIcon />
      </Box>
    </Box>
  );
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

function AnnouncementsList(): JSX.Element {
  const [addEditModal, setAddEditModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;
  const { t } = useTranslation();

  const getAllAnnouncements = (): void => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceptor
      .get('api/Anouncement/GetAllAnnouncement')
      .then((response: AxiosResponse<Announcement[]>) => {
        const rows = response.data.map((row: Announcement) =>
          createData(
            row.title,
            row.description,
            <Stack direction="row" alignItems="center" gap={1}>
              <CalendarIcon />
              <Box>
                {dayjs(row.expiryDate).format('DD MMM, YYYY')}
              </Box>
            </Stack>,
            <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
              <CircleIcon color={row.isVisibleToUser ? "success" : "error"} fontSize="inherit" />
              <Typography sx={{ fontSize: 14 }}>{row.isVisibleToUser ? t('Yes') : t('No')}</Typography>
            </Stack>,
            <CellAction
              onEdit={() => { onEdit(row) }}
              onDelete={() => { onDelete(row) }}
            />
          )
        );
        setRowData(rows);
        setLoading(false);
      })
      .catch((error: { message: string }) => {
        showMessage(error.message, 'error');
      });
  };

  const createNewAnnouncement = (data: Announcement) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceptor
      .post('api/Anouncement/AddAnouncement', {
        title: data.title,
        description: data.description,
        expiryDate: data.expiryDate,
        isVisibleToUser: data.isVisibleToUser || false,
      })
      .then(() => {
        getAllAnnouncements();
        showMessage('Announcement created successfully', 'success');
        setLoading(false);
      })
      .catch((error: { message: string }) => {
        showMessage(error.message, 'error');
      });
  };

  const updateAnnouncement = (data: Announcement) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceptor
      .post('api/Anouncement/UpdateAnouncement', {
        anouncementId: data.anouncementId,
        title: data.title,
        description: data.description,
        expiryDate: data.expiryDate,
        isVisibleToUser: data.isVisibleToUser,
      })
      .then(() => {
        getAllAnnouncements();
        showMessage('Announcement updated successfully', 'success');
        setLoading(false);
      })
      .catch((error: { message: string }) => {
        showMessage(error.message, 'error');
      });
  };

  const deleteAnnouncement = (id: number) => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceptor
      .delete(`api/Anouncement/DeleteAnouncement?AnouncementId=${id}`)
      .then(() => {
        getAllAnnouncements();
        showMessage('Announcement deleted successfully', 'success');
        setDeleteModal(false);
        setLoading(false);
        setSelected(null);
      })
      .catch((error: { message: string }) => {
        showMessage(error.message, 'error');
      });
  };

  useEffect(() => {
    getAllAnnouncements();
  }, []);

  const onEdit = (row: Announcement) => {
    setAddEditModal(true);
    setSelected(row);
  };

  const onDelete = (row: Announcement) => {
    setDeleteModal(true);
    setSelected(row);
  };

  return (
    <Box
      sx={() => ({
        borderRadius: '20px',
      })}
    >
      <EnhancedTable
        head={headCells}
        rows={rowData}
        isAddable={true}
        title={t('Announcement list')}
        loading={loading}
        onAddClick={() => { setAddEditModal(true); setSelected({ ...selected, expiryDate: new Date() }) }}
        btnTitle='Add New'
      />

      <BaseModal
        open={addEditModal}
        title='Announcements'
        handleClose={() => {
          setAddEditModal(false);
          setSelected(null);
        }}
        onSave={() => {
          if (!selected || !selected.title || !selected.expiryDate || !selected.description) {
            showMessage('Please fill in all required fields', 'error');
            return;
          }
          setAddEditModal(false);
          if (selected?.anouncementId && selected?.anouncementId !== 0) {
            const index = rowData.findIndex(
              (row: any) => row.id === selected.anouncementId
            );
            const temp: any = [...rowData];
            temp[index] = selected;
            setRowData(temp);
            updateAnnouncement(selected);
          } else {
            selected !== null && createNewAnnouncement(selected);
          }
          setSelected(null);
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Typography variant='body2'>{t('Title')}</Typography>
            <TextField
              variant='outlined'
              name='title'
              placeholder={t('Enter Title') ?? 'Enter Title'}
              value={selected?.title || ''}
              onChange={(e: any) => {
                setSelected({
                  ...selected,
                  title: e.target.value,
                });
              }}
              required
              error={selected?.title?.trim() === '' ? true : false}
              helperText={selected?.title?.trim() === '' ? 'Title is Required' : ''}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant='body2'>{t('Expiration date')}</Typography>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            // locale={i18n.language}
            >
              <DatePicker
                slots={{
                  openPickerIcon: CalendarIcon
                }}
                name='expiryDate'
                defaultValue={dayjs(new Date().toLocaleDateString('en-GB'))}
                value={dayjs(selected?.expiryDate)}
                format='DD/MM/YYYY'
                onChange={(newValue: any) => {
                  setSelected({
                    ...selected,
                    expiryDate: newValue && newValue.toDate(),
                  });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2'>{t('Description')}</Typography>
            <TextField
              variant='outlined'
              name='description'
              placeholder={
                t('Enter announcements description') ??
                'Enter announcements description'
              }
              multiline
              rows={4}
              value={selected?.description || ''}
              onChange={(e) => {
                setSelected({
                  ...selected,
                  description: e.target.value,
                });
              }}
              required
              error={selected?.description?.trim() === '' ? true : false}
              helperText={selected?.description?.trim() === '' ? 'Description is Required' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2'>{t('Visible to users')}</Typography>
            <Switch
              checked={selected?.isVisibleToUser || false}
              onChange={(e) => {
                setSelected({
                  ...selected,
                  isVisibleToUser: e.target.checked,
                });
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
        </Grid>
      </BaseModal>
      <DeleteModal
        open={deleteModal}
        message='Would you like to delete the selected announcement ?'
        title='Delete Announcement'
        onCancel={() => { setDeleteModal(false) }}
        onConfirm={() => { deleteAnnouncement(selected?.anouncementId || 0) }}
      />
    </Box>
  );
}

export default AnnouncementsList;
