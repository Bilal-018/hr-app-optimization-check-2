/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import EnhancedTable from '../../Global/Table';
import { CircularChip } from '../../Global/Chips';
import { Box, Typography } from '@mui/material';
import AvatarGroupBy from '../../Global/AvatarGroupBy';
import EmployeeInfo from './EmployeeInfo';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import { useTranslation } from 'react-i18next';
import SkillDistribution from './SkillDistribution';
import BinIcon from '../../Icon/BinIcon';

const headCells = [
  {
    id: 'skills',
    label: 'Skills',
  },
  {
    id: 'required',
    label: 'Required',
  },
  {
    id: 'distribution',
    label: 'Distribution',
  },
  {
    id: 'members',
    label: 'Members',
  },
  {
    id: 'percentage',
    label: 'Percentage',
  },
  // {
  //   id: 'action',
  //   label: 'Action',
  // },
];

function createData(
  skills: any,
  required: any,
  distribution: any,
  members: any,
  percentage: any,
  // Action: any
  searchableText: string,
) {
  return {
    skills,
    required,
    distribution,
    members,
    percentage,
    // Action,
    searchableText,
  };
}

function LayeredSkill({ skill, type }: any) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}
    >
      <Typography className='smallBodyBold'>{t(skill)}</Typography>
      <Typography
        className='smallBody'
        sx={{
          color: '#B3B3BF',
          fontStyle: 'italic',
        }}
      >
        {t(type)}
      </Typography>
    </Box>
  );
}

const SkillsDistribution = ({ skills, onClick }: any) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '5px',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      {skills.lstDistributionDetail.map((skill: any, i: any) => {
        const { skillExpertiseId, count, agendaColor } = skill;
        return (
          <CircularChip
            value={count}
            key={i}
            id={skillExpertiseId}
            color={agendaColor}
            sx={{
              marginLeft: '0px',
            }}
            onClick={() =>
              onClick(skillExpertiseId, skills.skillConfigurationId)
            }
          />
        );
      })}
    </Box>
  );
};

function CellAction({ onEdit, onDelete }: any) {
  return (
    <Box className='action-icon-rounded'>
      <Box onClick={onDelete}>
        <BinIcon />
      </Box>
    </Box>
  );
}

function ManagerSkillManagement() {
  const [userModal, setUserModal] = useState<any>(false);
  const [distributionModal, setDistributionModal] = useState<any>(false);

  const [managerskillsData, setManagerSkillsDataState] = useState<any>([]);
  const [allskillsData, setallskillsData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const initialized = useRef(false);
  const bearerToken = sessionStorage.getItem('token_key');
  const email = sessionStorage.getItem('email_key');
  const [selectedSkillId, setSelectedSkillId] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [skillId, setskillId] = useState<any>(null);
  const [SkillDistributionList, setSkillDistribution] = useState<any>(null);

  const navigate = useNavigate();
  const { showMessage }: any = useSnackbar();
  const base_url = process.env.REACT_APP_BASE_URL;

  const handleUserClick =
    (skillConfigurationId: any, allSkills: any) => (index: any) => {
      const skill = allSkills.find(
        (item: any) => item.skillConfigurationId === skillConfigurationId
      );
      handelUserClick(skill.lstSkillEmployeeDetail[index].employeeDetailId);
    };

  const GetmanagerSkillsListData = async () => {
    setLoading(true);
    const tblRows: any = [];

    jwtInterceptor
      .get('api/SkillManager/GetSkillDashboardForManager')
      .then((response: any) => {
        for (var x of response.data.dashboardData) {
          //console.log("Skills data", x);
          setallskillsData(response.data);
          let profilePictures = [];
          for (var i of x.lstSkillEmployeeDetail) {
            let pictureURI =
              process.env.REACT_APP_API_PROFILE_SERVICE_URL +
              '/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
              i.employeeDetailId +
              '&email=' +
              email;
            profilePictures.push(pictureURI);
          }

          const skillText = x.skill;
          const requiredScoreText = x.requiredScore.toString();
          const percentage = x.percentage;

          // Combine all text for searchable text
          const searchableText = [
            skillText,
            requiredScoreText,
            percentage,
          ].join(' ');

          tblRows.push(
            createData(
              <LayeredSkill skill={x.skill} type={x.skillType} />,
              <CircularChip value={x.requiredScore} color='#18A0FB' />,
              <SkillsDistribution skills={x} onClick={handleUserImageClick} />,
              <AvatarGroupBy
                images={profilePictures}
                // eslint-disable-next-line no-loop-func
                onClick={handleUserClick(x.skillConfigurationId, response.data.dashboardData)}
              />,
              x.percentage,
              // <CellAction
              // id={x.employeeSkillId}
              // onEdit={() => {
              //   onEdit('Edit', item);
              // }}
              // onDelete={() => onDelete(eId)}
              // />
              searchableText,
            )
          );
        }
        setManagerSkillsDataState(tblRows);
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const GetDistributionSkillsListData = async (id: any, skillId: any) => {
    setLoading(true);
    const tblRows = [];

    jwtInterceptor
      .get(
        'api/SkillManager/GetSkillDetailBySkillConfigurationId?SkillExpertise=' +
        id +
        '&SkillConfigurationId=' +
        skillId +
        ''
      )
      .then((response: any) => {
        setSkillDistribution(response.data);
        setDistributionModal(true);
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handleUserImageClick = (id: any, skillid: any) => {
    setSelectedSkillId(id);
    setskillId(skillid);

    GetDistributionSkillsListData(id, skillid);
  };

  const handelUserClick = (empId: any) => {
    setDistributionModal(false);
    setUserModal(true);
    setSelectedEmployee(empId);
  };
  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetmanagerSkillsListData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('allSkillData', allskillsData);
  }, [allskillsData]);

  const { t, i18n } = useTranslation();

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={managerskillsData}
        loading={loading}
        title={t('Manage Skills')}
      />

      {selectedEmployee && (
        <EmployeeInfo
          open={userModal}
          setOpen={setUserModal}
          id={selectedEmployee}
        />
      )}

      <SkillDistribution
        open={distributionModal}
        setOpen={setDistributionModal}
        handelUserClick={handelUserClick}
        state={SkillDistributionList}
      // skill={allskillsData.find((item) => item.skillConfigurationId === skillId)}
      />
    </>
  );
}

export default ManagerSkillManagement;
