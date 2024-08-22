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
import { AxiosError, AxiosResponse } from 'axios';

interface CellActionProps {
  id: number;
  // eslint-disable-next-line
  onEdit: (id: number) => void;
  // eslint-disable-next-line
  onDelete: (id: number) => void;
}

function CellAction({ id, onEdit, onDelete }: CellActionProps) {
  return (
    <Box className='action-icon-rounded'>
      <Button
        onClick={() => { onEdit(id) }}
      >
        <EditIcon />
      </Button>
      <Button
        onClick={() => { onDelete(id) }}
      >
        <BinIcon />
      </Button>
    </Box>
  );
}

function createData(
  skill: string,
  skillLevel: string,
  skillScore: JSX.Element,
  // eslint-disable-next-line
  onEdit: (id: number) => void,
  id: number,
  // eslint-disable-next-line
  onDelete: (id: number) => void
) {
  return {
    skill,
    skillLevel,
    skillScore,
    Action: <CellAction id={id} onEdit={onEdit} onDelete={onDelete} />,
  };
}

interface ModalState {
  open: boolean;
  id: number | null;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

interface SkillExpertise {
  skillExpertiseId: number;
  expertise: string;
  agendaColor: string;
}

interface SkillExpertiseState {
  id: number;
  value: string;
}

interface SkillConfiguration {
  skillConfigurationId: number;
  skill: string;
  skillType: string;
  requiredScore: number;
  requiredSkillAchievementId: number;
}

interface SkillConfigurationState {
  id?: number | null;
  skill: string;
  skillType: string;
  achievementScore: number;
}

interface SkillAchievement {
  skillAchievementId: number;
  description: string;
  score: number;
}

interface SkillAchievementState {
  id: number;
  title: string;
  value: number;
}

interface SkillType {
  skillTypeDetailId: number;
  skillType: string;
}

function EmployeeInfo() {
  const [newSkill, setNewSkill] = useState<ModalState>({
    open: false,
    id: null,
  });
  const [skillExpertiseList, setSkillExpertiseList] = useState<SkillExpertise[]>([]);
  const [skillAchievementList, setSkillAchievementList] = useState<SkillAchievement[]>([]);
  const [SkillConfiguration, setSkillConfiguration] = useState<SkillConfiguration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    open: false,
    id: null,
  });

  const onEdit = (id: number) => {
    setNewSkill({
      open: true,
      id,
    });
  };

  const getExpertise = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillExpertiseList')
      .then((res: AxiosResponse<SkillExpertise[]>) => {
        setSkillExpertiseList(res.data);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSkillsConfiguration = () => {
    setTableLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillConfigurationList')
      .then((res: AxiosResponse<SkillConfiguration[]>) => {
        setSkillConfiguration(res.data);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const getSkillAchievement = () => {
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/SkillConfiguration/GetSkillAchievementList')
      .then((res: AxiosResponse<SkillAchievement[]>) => {
        setSkillAchievementList(res.data);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const updateAchievement = (data: SkillAchievementState) => {
    // eslint-disable-next-line
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
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const updateExpertise = (data: SkillExpertiseState) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/SkillConfiguration/UpdateSkillExpertise', {
        skillExpertiseId: data.id,
        expertise: data.value,
      })
      .then(() => {
        showMessage('Skill Expertise Updated Successfully', 'success');
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  useEffect(() => {
    getExpertise();
    getSkillAchievement();
    getSkillsConfiguration();
    getSkillTypeConfig();
  }, []);

  const onExpertiseSave = ({ updatedFields }: any) => {
    if (updatedFields.length > 0) {
      updatedFields.forEach((item: SkillExpertiseState) => {
        return updateExpertise(item);
      });
    }
    getExpertise();
  };

  const onAchievementSave = ({ updatedFields }: any) => {
    if (updatedFields.length > 0) {
      updatedFields.forEach((item: SkillAchievementState) => {
        return updateAchievement(item);
      });
    }
    getSkillAchievement();
  };

  const addNewSkill = (data: SkillConfigurationState) => {
    // eslint-disable-next-line
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
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const [skillTypes, setskillTypes] = useState<SkillType[]>([]);

  const getSkillTypeConfig = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/SkillConfiguration/GetAllSkillTypeDetailList')
      .then((res: AxiosResponse<SkillType[]>) => {
        setskillTypes(res.data);
      });
  };

  const updateSkill = (data: SkillConfigurationState) => {
    // eslint-disable-next-line
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
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const deleteSkill = (id: number) => {
    jwtInterceoptor
      .delete(
        `api/SkillConfiguration/DeleteSkillConfiguration?SkillConfigurationId=${id}`
      )
      .then(() => {
        getSkillsConfiguration();
        showMessage('Skill Configuration Deleted Successfully', 'success');
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data as { Message: string };
          showMessage(errorMessage.Message, 'error');
        } else if (error instanceof Error) {
          showMessage(error.message, 'error');
        } else {
          showMessage('An unknown error occurred', 'error');
        }
      });
  }

  const onDeleteConfirm = () => {
    if (deleteModal.id !== null) {
      deleteSkill(deleteModal.id);
      getSkillsConfiguration();
      setDeleteModal({
        open: false,
        id: null,
      });
    }
  };

  const onDelete = (id: number) => {
    setDeleteModal({
      open: true,
      id: id,
    });
  };

  const onAddNewSkill = (data: SkillConfigurationState) => {
    setNewSkill({
      open: false,
      id: null,
    });
    if (data.id) {
      updateSkill(data);
    } else {
      addNewSkill(data);
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
                values={skillExpertiseList.map((item: SkillExpertise) => ({
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
                values={skillAchievementList.map((item: SkillAchievement) => ({
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
            sx={() => ({
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
              rows={SkillConfiguration.map((item: SkillConfiguration) =>
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
              onAddClick={() => {
                setNewSkill({
                  open: true,
                  id: null,
                })
              }}
            />
          </Grid>
          <SkillTypeSetting />
        </Grid>
      </Grid>
      <AddNewSkill
        open={newSkill.open}
        handleClose={() => {
          setNewSkill({
            open: false,
            id: null,
          })
        }}
        skillTypes={skillTypes}
        handleSave={onAddNewSkill}
        skillAchievementList={skillAchievementList}
        skill={() => {
          const skill = SkillConfiguration.find(
            (item: SkillConfiguration) => item.skillConfigurationId === newSkill.id
          );

          if (!skill) {
            return {
              skill: '',
              skillType: '',
              achievementScore: 0,
              id: null,
            }
          }

          return {
            skill: skill.skill,
            skillType: skill.skillType,
            achievementScore: skill.requiredSkillAchievementId,
            id: skill.skillConfigurationId,
          };
        }}
      />
      <DeleteModal
        message={'Are you sure you want to delete this skill?'}
        title={'Delete Skill'}
        onCancel={() => { setDeleteModal({ open: false, id: null }) }}
        onConfirm={onDeleteConfirm}
        open={deleteModal.open}
      />
    </>
  );
}

export default EmployeeInfo;
