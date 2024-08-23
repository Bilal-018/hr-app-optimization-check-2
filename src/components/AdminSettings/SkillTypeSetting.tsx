/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import EnhancedTable from '../Global/Table';
import jwtInterceoptor from '../../services/interceptors';
import { Box, Grid } from '@mui/material';
import BaseModal from '../Global/Modal';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';
import { AxiosResponse } from 'axios';

const initialState = {
  skillType: '',
};

interface SkillTypeInfo {
  skillType: string;
}

interface ModalState {
  open: boolean;
  id: number | null;
  isEditMode: boolean;
}

interface ErrorState {
  skillType: boolean;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

interface SkillConfig {
  skillTypeDetailId: number;
  skillType: string;
}

interface SkillTypeDetailResponse {
  StatusCode?: string;
  Message?: string;
}

interface DeleteModalState {
  open: boolean;
  id: number | null;
}

interface CellActionProps {
  onEdit: () => void;
  onDelete: () => void;
}

function SkillTypeSetting() {
  const [open, setOpen] = useState<ModalState>({
    open: false,
    id: null,
    isEditMode: false
  });

  const [errors, setErrors] = useState<ErrorState>({
    skillType: false,
  });

  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const [skillTypeInfo, setSkillTypeInfo] = useState<SkillTypeInfo>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSkillTypeInfo((prev: SkillTypeInfo) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { t } = useTranslation();

  const onSave = () => {
    try {
      const { skillType } = skillTypeInfo;

      const errors = validate(skillTypeInfo);
      if (Object.values(errors).some((item) => item)) {
        setErrors(errors);
        return;
      }

      setErrors({
        skillType: false,
      });
      if (open.isEditMode && open.id) {
        addOrUpdateSkillType(skillType, open.id);
      } else {
        addOrUpdateSkillType(skillType, null);
      }
      setSkillTypeInfo(initialState);
      setOpen({ open: false, id: null, isEditMode: false });
    } catch (error) {
      console.error('Error creating Skill Type:', error);
    }
  };

  const validate = (values: SkillTypeInfo) => {
    let errors = {
      skillType: false,
    };
    if (!values.skillType || values.skillType.trim() === '') {
      errors.skillType = true;
    }
    return errors;
  };

  const headCells = [
    {
      id: 'skillType',
      label: 'Skill Type',
    },
    {
      id: 'nullHeader',
      label: null,
    },
    {
      id: 'nullHeader1',
      label: null,
    },
    {
      id: 'Actions',
      label: 'Action',
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [skillConfig, setSkillConfig] = useState<SkillConfig[]>([]);

  useEffect(() => {
    getSkillTypeConfig();
  }, []);

  const getSkillTypeConfig = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/SkillConfiguration/GetAllSkillTypeDetailList')

      .then((res: AxiosResponse<SkillConfig[]>) => {
        setSkillConfig(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => { console.log("error is: ", err) });
  };

  const addOrUpdateSkillType = (
    skillType: string,
    skillTypeDetailId: number | null
  ) => {
    setLoading(true);
    try {
      if (skillTypeDetailId) {
        // eslint-disable-next-line
        jwtInterceoptor
          .post('api/SkillConfiguration/UpdateSkillTypeDetail', {
            skillTypeDetailId,
            skillType,
          })
          .then((res: AxiosResponse<SkillTypeDetailResponse>) => {
            if (
              res.data.StatusCode != undefined &&
              res.data.StatusCode !== '200'
            ) {
              showMessage(res.data.Message ?? 'An error occurred.', 'error');
            } else {
              showMessage('Skill Type Updated Successfully!', 'success');
            }
          });
      } else {
        // eslint-disable-next-line
        jwtInterceoptor
          .post('api/SkillConfiguration/CreateSkillTypeDetail', {
            skillType,
          })
          .then((res: AxiosResponse<SkillTypeDetailResponse>) => {
            if (
              res.data.StatusCode != undefined &&
              res.data.StatusCode !== '200'
            ) {
              showMessage(res.data.Message ?? 'An error occurred.', 'error');
            } else {
              showMessage(t('Skill Type Added Successfully!'), 'success');
            }
          });
      }

      getSkillTypeConfig();
    } catch (error: unknown) {
      console.error('Error saving Skill Type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    try {
      setLoading(true);
      // eslint-disable-next-line
      jwtInterceoptor
        .delete(
          `api/SkillConfiguration/DeleteSkillTypeDetail?skillTypeDetailId=${deleteModal.id}`
        )
        .then((res: AxiosResponse<SkillTypeDetailResponse>) => {
          if (
            res.data.StatusCode != undefined &&
            res.data.StatusCode !== '200'
          ) {
            showMessage(res.data.Message ?? 'An error occurred.', 'error');
          } else {
            showMessage(t('Skill Type deleted successfully!'), 'success');
          }
        });
      getSkillTypeConfig();
      setDeleteModal({
        open: false,
        id: null,
      });
    } catch (error: unknown) {
      console.error('Error deleting Skill Type:', error);
    } finally {
      setLoading(false);
    }
  };

  function createData(
    SkillType: string,
    id: number,
    // eslint-disable-next-line
    onEdit: (rowData: SkillConfig) => void,
    // eslint-disable-next-line
    onDelete: (id: number) => void,
    rowData: SkillConfig
  ) {
    return {
      SkillType,
      nullHeader: null,
      nullHeader1: null,
      Action: (
        <CellAction
          onEdit={() => { onEdit(rowData) }}
          onDelete={() => { onDelete(id) }}
        />
      ),
    };
  }

  function CellAction({ onEdit, onDelete }: CellActionProps) {
    return (
      <Box className='action-icon-rounded'>
        <Button
          onClick={onEdit}
        >
          <EditIcon />
        </Button>
        <Button
          onClick={onDelete}
        >
          <BinIcon />
        </Button>
      </Box>
    );
  }

  const onEdit = (rowData: SkillConfig) => {
    setOpen({
      open: true,
      id: rowData.skillTypeDetailId,
      isEditMode: true,
    });
    setSkillTypeInfo({
      skillType: rowData.skillType,
    });
  };

  const onDelete = (id: number) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    id: null,
  });

  return (
    <>
      <Grid
        sx={() => ({
          padding: '5px',
          borderRadius: '10px',
          marginTop: '10px',
        })}
      >
        <EnhancedTable
          head={headCells}
          rows={skillConfig.map((item: SkillConfig) =>
            createData(
              item.skillType,
              item.skillTypeDetailId,
              onEdit,
              onDelete,
              item
            )
          )}
          btnTitle='Add New'
          isAddable={true}
          onAddClick={() => {
            setOpen({
              open: true,
              id: null,
              isEditMode: false
            })
          }}
          loading={loading}
        />
        <BaseModal
          title={
            open.isEditMode
              ? t('Admin - Update Skill Type')
              : t('Admin - New Skill Type')
          }
          handleClose={() => {
            setOpen({
              open: false,
              id: null,
              isEditMode: false,
            });
            setSkillTypeInfo(initialState);
            setErrors({
              skillType: false,
            });
          }}
          onSave={onSave}
          open={open.open}
          skillTypeData={skillConfig.find(
            (item: SkillConfig) => item.skillTypeDetailId === open.id
          )}
        >
          <Grid item xs={12}>
            <Box sx={{ mt: '10px' }}>
              <Typography className='SmallBody'>{t('Skill Type')}</Typography>
            </Box>
            <Box>
              <TextField
                name='skillType'
                placeholder={`${t('Enter the skill type')}`}
                value={skillTypeInfo.skillType}
                onChange={handleChange}
                sx={{ width: '100%', mb: '10px' }}
                error={errors.skillType}
                helperText={errors.skillType && t('Skill Type is required')}
              />
            </Box>
          </Grid>
        </BaseModal>
        <DeleteModal
          open={deleteModal.open}
          message={t('Are you sure you want to delete this Skill Type?')}
          title={t('Delete Skill Type')}
          onCancel={() => {
            setDeleteModal({
              open: false,
              id: null,
            });
          }}
          onConfirm={handleConfirmDelete}
        />
      </Grid>
    </>
  );
}

export default SkillTypeSetting;
