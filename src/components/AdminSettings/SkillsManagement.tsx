import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EnhancedTable from '../Global/Table';
import { CircularChip } from '../Global/Chips';
import AddNewSkill from './AddNewSkill';
import InfoCards from './InfoCards';
import jwtInterceoptor from '../../services/interceptors';
import { useSnackbar } from '../Global/WithSnackbar';
import DeleteModal from '../Global/DeleteModal';
import SkillTypeSetting from './SkillTypeSetting';
import { useTranslation } from 'react-i18next';
import EditIcon from '../Icon/EditIcon';
import BinIcon from '../Icon/BinIcon';

function CellAction({ id, onEdit, onDelete }: any) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={() => onEdit(id)}
      >
        <EditIcon />
      </Button>
      <Button
        onClick={() => onDelete(id)}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

function createData(
  skill: any,
  skillLevel: any,
  skillScore: any,
  onEdit: any,
  id: any,
  onDelete: any
) {
  return {
    skill,
    skillLevel,
    skillScore,
    Action: <CellAction id={id} onEdit={onEdit} onDelete={onDelete} />,
  };
}

function EmployeeInfo() {
  const [newSkill, setNewSkill] = useState<any>({
    open: false,
    id: null,
  });
  const [skillExpertiseList, setSkillExpertiseList] = useState<any>([]);
  const [skillAchievementList, setSkillAchievementList] = useState<any>([]);
  const [SkillConfiguration, setSkillConfiguration] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [tableLoading, setTableLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [deleteModal, setDeleteModal] = useState<any>({
    open: false,
    id: null,
  });

  const onEdit = (id: any) => {
    setNewSkill({
      open: true,
      id,
    });
  };

  const getExpertise = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillExpertiseList')
      .then((res: any) => {
        setSkillExpertiseList(res.data);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSkillsConfiguration = () => {
    setTableLoading(true);
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillConfigurationList')
      .then((res: any) => {
        setSkillConfiguration(res.data);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const getSkillAchievement = () =>
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillAchievementList')
      .then((res: any) => {
        setSkillAchievementList(res.data);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const updateAchievement = (data: any) =>
    jwtInterceoptor
      .post('api/SkillConfiguration/UpdateSkillAchievement', {
        skillAchievementId: data.id,
        score: data.value,
        description: data.title,
      })
      .then(() => {
        showMessage('Skill Achievement Updated Successfully', 'success');
        getSkillAchievement();
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const updateExpertise = (data: any) =>
    jwtInterceoptor
      .post('api/SkillConfiguration/UpdateSkillExpertise', {
        skillExpertiseId: data.id,
        expertise: data.value,
      })
      .then(() => {
        showMessage('Skill Expertise Updated Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  useEffect(() => {
    getExpertise();
    getSkillAchievement();
    getSkillsConfiguration();
    getSkillTypeConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onExpertiseSave = async ({ updatedFields }: any) => {
    if (updatedFields.length > 0) {
      await updatedFields.forEach((item: any) => {
        return updateExpertise(item);
      });
    }
    getExpertise();
  };

  const onAchievementSave = async ({ updatedFields }: any) => {
    if (updatedFields.length > 0) {
      await updatedFields.forEach((item: any) => {
        return updateAchievement(item);
      });
    }
    getSkillAchievement();
  };

  const addNewSkill = (data: any) =>
    jwtInterceoptor
      .post('api/SkillConfiguration/CreateSkillConfigurations', {
        skill: data.skill,
        skillType: data.skillType,
        requiredSkillAchievementId: data.achievementScore,
      })
      .then(() => {
        getSkillsConfiguration();
        showMessage('Skill Configuration Added Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const [skillTypes, setskillTypes] = useState([]);

  const getSkillTypeConfig = async () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/SkillConfiguration/GetAllSkillTypeDetailList')
      .then((res: any) => {
        setskillTypes(res.data);
      });
  };

  const updateSkill = (data: any) =>
    jwtInterceoptor
      .post('api/SkillConfiguration/UpdateSkillConfiguration', {
        skillConfigurationId: data.id,
        skill: data.skill,
        skillType: data.skillType,
        requiredSkillAchievementId: data.achievementScore,
      })
      .then(() => {
        getSkillsConfiguration();
        showMessage('Skill Configuration Updated Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const deleteSkill = (id: any) =>
    jwtInterceoptor
      .delete(
        `api/SkillConfiguration/DeleteSkillConfiguration?SkillConfigurationId=${id}`
      )
      .then(() => {
        getSkillsConfiguration();
        showMessage('Skill Configuration Deleted Successfully', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const onDeleteConfirm = async () => {
    await deleteSkill(deleteModal.id);
    getSkillsConfiguration();
    setDeleteModal({
      open: false,
      id: null,
    });
  };

  const onDelete = (id: any) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };

  const onAddNewSkill = async (data: any) => {
    setNewSkill({
      open: false,
      id: null,
    });
    if (data.id) {
      await updateSkill(data);
    } else {
      await addNewSkill(data);
    }
    getSkillsConfiguration();
  };

  const { t } = useTranslation();

  return (
    <>
      <Grid container gap={3} p={1}>
        <Grid item xs={11.5} lg={5.6} className='section-border'>
          <h3>{t('Skill Management')}</h3>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <InfoCards
                values={skillExpertiseList.map((item: any) => ({
                  id: item.skillExpertiseId,
                  value: item.expertise,
                }))}
                title={'Expertise'}
                loading={loading}
                onSave={onExpertiseSave}
                addAndDelete={false}
                saveOnTop={true}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <InfoCards
                twoTier
                title2='Score Description'
                title={'Score'}
                values={skillAchievementList.map((item: any) => ({
                  id: item.skillAchievementId,
                  value: item.score,
                  title: item.description,
                }))}
                addAndDelete={false}
                onSave={onAchievementSave}
                loading={loading}
                numberLimit={5}
                saveOnTop={true}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6.1}>
          <Grid
            sx={(theme) => ({
              padding: '5px',
              borderRadius: '10px',
              marginTop: '2px',
            })}
          >
            <EnhancedTable
              head={[
                {
                  id: 'skill',
                  label: 'Skill',
                },
                {
                  id: 'skillType',
                  label: 'Skill Type',
                },
                {
                  id: 'levelRequired',
                  label: 'Level Required',
                },
                {
                  id: 'action',
                  label: 'Action',
                },
              ]}
              rows={SkillConfiguration.map((item: any) =>
                createData(
                  item.skill,
                  item.skillType,
                  <CircularChip value={item.requiredScore} />,
                  onEdit,
                  item.skillConfigurationId,
                  onDelete
                )
              )}
              btnTitle='Add New'
              isAddable={true}
              sx={{
                minWidth: '100%',
              }}
              loading={tableLoading}
              onAddClick={() =>
                setNewSkill({
                  open: true,
                  id: null,
                })
              }
            />
          </Grid>
          <SkillTypeSetting />
        </Grid>
      </Grid>
      <AddNewSkill
        open={newSkill.open}
        handleClose={() =>
          setNewSkill({
            open: false,
            id: null,
          })
        }
        skillTypes={skillTypes}
        handleSave={onAddNewSkill}
        skillAchievementList={skillAchievementList}
        skill={() => {
          const skill = SkillConfiguration.find(
            (item: any) => item.skillConfigurationId === newSkill.id
          );

          return {
            skill: skill?.skill,
            skillType: skill?.skillType,
            achievementScore: skill?.requiredSkillAchievementId,
            id: skill?.skillConfigurationId,
          };
        }}
      />
      <DeleteModal
        message={'Are you sure you want to delete this skill?'}
        title={'Delete Skill'}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        onConfirm={onDeleteConfirm}
        open={deleteModal.open}
      />
    </>
  );
}

export default EmployeeInfo;
