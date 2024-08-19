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

const initialState = {
  skillType: '',
  errors: [],
};

function SkillTypeSetting() {
  const [open, setOpen] = useState<any>({
    open: false,
    id: null,
  });

  const [errors, setErrors] = useState<any>({
    skillType: false,
  });

  const { showMessage }: any = useSnackbar();

  const [skillTypeInfo, setSkillTypeInfo] = useState<any>(initialState);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSkillTypeInfo((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { t } = useTranslation();

  const onSave = async () => {
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
      //   const data = { skillType, skillTypeDetailId: open.id };
      if (open.isEditMode && open.id) {
        await addOrUpdateSkillType(skillType, open.id);
      } else {
        await addOrUpdateSkillType(skillType, null);
      }
      setSkillTypeInfo(initialState);
      setOpen({ open: false, id: null, isEditMode: false });
    } catch (error) {
      console.error('Error creating Skill Type:', error);
    }
  };

  const validate = (values: any) => {
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

  const [loading, setLoading] = useState<any>(false);
  const [skillConfig, setSkillConfig] = useState<any>([]);

  useEffect(() => {
    getSkillTypeConfig();
  }, []);

  const getSkillTypeConfig = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/SkillConfiguration/GetAllSkillTypeDetailList')

      .then((res: any) => {
        console.log(res.data);
        setSkillConfig(res.data);
        setLoading(false);
      })
      .catch((err: any) => { console.log("error is: ", err) });
  };

  const addOrUpdateSkillType = async (
    skillType: any,
    skillTypeDetailId: any
  ) => {
    setLoading(true);
    try {
      if (skillTypeDetailId) {
        await jwtInterceoptor
          .post('api/SkillConfiguration/UpdateSkillTypeDetail', {
            skillTypeDetailId,
            skillType,
          })
          .then((res: any) => {
            if (
              res.data.StatusCode != undefined &&
              res.data.StatusCode !== '200'
            ) {
              showMessage(res.data.Message, 'error');
            } else {
              showMessage('Skill Type Updated Successfully!', 'success');
            }
          });
      } else {
        await jwtInterceoptor
          .post('api/SkillConfiguration/CreateSkillTypeDetail', {
            skillType,
          })
          .then((res: any) => {
            if (
              res.data.StatusCode != undefined &&
              res.data.StatusCode !== '200'
            ) {
              showMessage(res.data.Message, 'error');
            } else {
              showMessage(t('Skill Type Added Successfully!'), 'success');
            }
          });
      }

      getSkillTypeConfig();
    } catch (error) {
      console.error('Error saving Skill Type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await jwtInterceoptor
        .delete(
          `api/SkillConfiguration/DeleteSkillTypeDetail?skillTypeDetailId=${deleteModal.id}`
        )
        .then((res: any) => {
          if (
            res.data.StatusCode != undefined &&
            res.data.StatusCode !== '200'
          ) {
            showMessage(res.data.Message, 'error');
          } else {
            showMessage(t('Skill Type deleted successfully!'), 'success');
          }
        });
      getSkillTypeConfig();
      setDeleteModal({
        open: false,
        id: null,
      });
    } catch (error) {
      console.error('Error deleting Skill Type:', error);
    } finally {
      setLoading(false);
    }
  };

  function createData(
    SkillType: any,
    id: any,
    onEdit: any,
    onDelete: any,
    rowData: any
  ) {
    return {
      SkillType,
      nullHeader: null,
      nullHeader1: null,
      Action: (
        <CellAction
          onEdit={() => onEdit(rowData)}
          onDelete={() => onDelete(id)}
        />
      ),
    };
  }

  function CellAction({ onEdit, onDelete }: any) {
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

  const onEdit = (rowData: any) => {
    setOpen({
      open: true,
      id: rowData.skillTypeDetailId,
      isEditMode: true,
    });
    setSkillTypeInfo({
      skillType: rowData.skillType,
    });
  };

  const onDelete = (id: any) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
  });

  return (
    <>
      <Grid
        sx={(theme) => ({
          padding: '5px',
          borderRadius: '10px',
          marginTop: '10px',
        })}
      >
        <EnhancedTable
          head={headCells}
          rows={skillConfig.map((item: any) =>
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
          onAddClick={() =>
            setOpen({
              open: true,
              id: null,
            })
          }
          // title="Bank holiday setting"
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
            (item: any) => item.skillTypeDetailId === open.id
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
