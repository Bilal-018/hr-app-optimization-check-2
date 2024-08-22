import React, { useEffect, useState } from 'react';
import BaseModal from '../Global/Modal';
import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { errorHelperText } from '../../utils/validation';
import { useTranslation } from 'react-i18next';
import Select from '../Global/Select';

interface SkillDetails {
  skill: string;
  skillType: string;
  achievementScore: number;
  id?: number | null;
}

const initialState: SkillDetails = {
  skill: '',
  skillType: '',
  achievementScore: 0,
};

interface ValidationErrors {
  skill: boolean;
  skillType: boolean;
  achievementScore: boolean;
}

let initialErrors: ValidationErrors = {
  skill: false,
  skillType: false,
  achievementScore: false,
};
const validate = (values: SkillDetails) => {
  let errors: ValidationErrors = { ...initialErrors };

  if (!values.skill || values.skill.trim() === '') {
    errors.skill = true;
  }
  if (!values.skillType || values.skillType.trim() === '') {
    errors.skillType = true;
  }

  if (!values.achievementScore || values.achievementScore === 0) {
    errors.achievementScore = true;
  }

  console.log('TEST errors', errors, values);

  return errors;
};

interface SkillAchievement {
  skillAchievementId: number;
  description: string;
  score: number;
}

interface SkillType {
  skillTypeDetailId: number;
  skillType: string;
}

interface AddNewSkillProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line
  handleSave: (skillDetails: SkillDetails) => void;
  skillAchievementList: SkillAchievement[];
  skill: () => SkillDetails;
  skillTypes: SkillType[];
}

const AddNewSkill = ({
  open,
  handleClose,
  handleSave,
  skillAchievementList,
  skill,
  skillTypes,
}: AddNewSkillProps) => {
  const [skillDetails, setSkillDetails] = useState<SkillDetails>(initialState);
  const [erros, setErros] = useState<ValidationErrors>(initialErrors);

  const onSave = () => {
    const errors = validate(skillDetails);

    if (errors.skill || errors.skillType || errors.achievementScore) {
      setErros(errors);
      return;
    }

    setSkillDetails(initialState);
    setErros(initialErrors);

    handleSave(skillDetails);
  };

  useEffect(() => {
    if (skill) {
      setSkillDetails(skill);
    }
  }, [skill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: string, value: string | number};
    setSkillDetails((pre: SkillDetails) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return { ...pre, [name]: value };
      } else {
        console.error('Invalid value type for %s:', name, value);
        return pre;
      }
    });
  };

  const { t } = useTranslation();

  return (
    <BaseModal
      title={'Admin - New skill'}
      handleClose={handleClose}
      onSave={onSave}
      open={open}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Skill')}</Typography>
          <TextField
            variant='outlined'
            name='skill'
            placeholder={t('Enter skill').toString()}
            value={skillDetails.skill}
            onChange={handleChange}
            error={erros.skill}
            helperText={erros.skill && t('Please enter a valid skill')}
          />
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Skill type')}</Typography>
          <Box mt={1}>
            <Select
              placeholder={t('Select skill type')}
              value={skillTypes.find((item: SkillType) => {
                return item.skillType.toLowerCase() === skillDetails.skillType?.toLowerCase();
              })?.skillType ?? ''}
              onChange={handleChange}
              name='skillType'
              variant='outlined'
              fullWidth
              error={erros.skillType}
            >
              {skillTypes.map((item: SkillType) => (
                <MenuItem value={item.skillType}>{item.skillType}</MenuItem>
              ))}
            </Select>
            {erros.skillType &&
              errorHelperText(t('Please select a skill type'))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={5.75}>
          <Typography className='SmallBody'>{t('Level Required')}</Typography>
          <Box mt={1}>
            <Select
              value={`${skillAchievementList.find((item: SkillAchievement) => {
                return item.skillAchievementId === skillDetails.achievementScore;
              })?.description ?? ''}${skillAchievementList.find((item: SkillAchievement) => item.skillAchievementId === skillDetails.achievementScore)?.score ? ` - ${skillAchievementList.find((item: SkillAchievement) => item.skillAchievementId === skillDetails.achievementScore)?.score}` : ''}`}
              onChange={handleChange}
              name='achievementScore'
              variant='outlined'
              fullWidth
              error={erros.achievementScore}
              placeholder={t('Select level required')}
            >
              {skillAchievementList.map((item: SkillAchievement) => (
                <MenuItem
                  value={item.skillAchievementId}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography className='SmallBody'>
                    {t(item.description)}
                  </Typography>{' '}
                  <Typography className='SmallBody'>{item.score}</Typography>
                </MenuItem>
              ))}
            </Select>
            {erros.achievementScore &&
              errorHelperText(t(t('Please select a score')))}
          </Box>
        </Grid>
      </Grid>
    </BaseModal>
  );
};

export default AddNewSkill;
