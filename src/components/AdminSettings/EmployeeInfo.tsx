/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import jwtInterceoptor from '../../services/interceptors';
import Contractstable from './Contractstable';
import { useSnackbar } from '../Global/WithSnackbar';
import DepartmentsTable from './DepartmentsTable';
import InfoCards from './InfoCards';
import { useTranslation } from 'react-i18next';
import Gendertable from './Genderstable';
const EmployeeInfo: React.FC = () => {
  const [genderData, setGenderData] = useState<any>([]);
  const [configData, setConfigData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();

  const getGender = () => {
    setLoading(true);

    jwtInterceoptor
      .get('api/GenderMaster/GetAllGenderMasters')
      .then((res: any) => {
        setGenderData(
          res.data.map((item: any) => ({
            id: item.genderId,
            value: item.gender,
          }))
        );

        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });
  };

  const GetAllConfigurationValue = () => {
    setLoading(true);

    jwtInterceoptor
      .get('api/ConfigurationValues/GetAllConfigurationValue')
      .then((res: any) => {
        setConfigData(
          res.data.map((item: any, i: any) => ({
            id: i * 2,
            value: item.value,
            title: item.key,
          }))
        );

        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });
  };

  useEffect(() => {
    GetAllConfigurationValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletGender = (id: any) =>
    jwtInterceoptor
      .delete(`api/GenderMaster/DeleteGenderMaster?GenderId=${id}`)
      .then((res: any) => {
        showMessage(res.data, 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const updateGender = (data: any) =>
    jwtInterceoptor
      .post('api/GenderMaster/UpdatedGenderMaster', {
        genderId: data.id,
        gender: data.value,
      })
      .then((res: any) => {
        showMessage(res.data, 'success');
        return res.data;
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const addGender = (data: any) =>
    jwtInterceoptor
      .post('api/GenderMaster/CreateGenderMaster', {
        gender: data.value,
      })
      .then((res: any) => {
        showMessage(res.data, 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const onGenderSave = async ({
    updatedFields,
    newFields,
    removedFields,
  }: any) => {
    await newFields.forEach((item: any) => {
      addGender(item);
    });
    await updatedFields.forEach((item: any) => {
      updateGender(item);
    });
    await removedFields.forEach((item: any) => {
      deletGender(item.id);
    });
  };

  const updateConfig = (data: any) =>
    jwtInterceoptor
      .post('api/ConfigurationValues/Update', {
        key: data.title,
        value: data.value,
      })
      .then((res: any) => {
        GetAllConfigurationValue();
        showMessage('Updated Configuration data', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const addConfig = (data: any) =>
    jwtInterceoptor
      .post('api/ConfigurationValues/Create', {
        key: data.title,
        value: data.value,
      })
      .then((res: any) => {
        GetAllConfigurationValue();
        showMessage('Added Configuration data', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const deleteConfig = (data: any) =>
    jwtInterceoptor
      .delete(`api/ConfigurationValues/Delete?key=${data.title}`)
      .then((res: any) => {
        GetAllConfigurationValue();
        showMessage('Deleted Configuration data', 'success');
      })
      .catch((err: any) => {
        showMessage(err.response.data.Message, 'error');
      });

  const onConfigSave = async ({
    updatedFields,
    newFields,
    removedFields,
  }: any) => {
    await newFields.forEach((item: any) => {
      addConfig(item);
    });
    await updatedFields.forEach((item: any) => {
      updateConfig(item);
    });
    await removedFields.forEach((item: any) => {
      deleteConfig(item);
    });

    GetAllConfigurationValue();
  };

  const { t } = useTranslation();

  return (
    <>
      <Grid
        container
        spacing={2}
        // rowGap={4}
        // p={1}
        justifyContent='space-between'
      >
        <Grid
          item
          md={7}
          xs={12}
          className='section-border'
          sx={(theme) => ({
            // border: `1px solid ${theme.palette.common.black}`,
            padding: 0,
          })}
        >
          <h3>{t('General Settings')}</h3>
          {/* <InfoCards
            values={genderData}
            onSave={onGenderSave}
            title='Gender'
            loading={loading}
          /> */}
          <Gendertable />
          <Contractstable />
        </Grid>

        <Grid
          item
          md={5}
          xs={12}
          className='section-border'
          sx={(theme) => ({
            // border: `1px solid ${theme.palette.common.black}`,
            padding: 0,
          })}
        >
          <DepartmentsTable />
          <InfoCards
            twoTier
            title2={t('Key')}
            values={configData}
            onSave={onConfigSave}
            title={t('Value')}
            saveOnTop
            mainTitle='Configuration Values'
            loading={loading}
          />
        </Grid>
      </Grid>
      {/* <Grid
        container
        // columnGap={1}
        // rowGap={4}
        // p={1}
        justifyContent='space-between'
      >
        <Grid
          item
          md={5.8}
          xs={12}
          className='section-border'
          sx={(theme) => ({
            // border: `1px solid ${theme.palette.common.black}`,
            padding: 0
          })}
        >
          <h3>{t('General Settings')}</h3>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <InfoCards
                values={genderData}
                onSave={onGenderSave}
                title='Gender'
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <InfoCards
                twoTier
                title2={t('Key')}
                values={configData}
                onSave={onConfigSave}
                title={t('Value')}
                saveOnTop
                mainTitle='Configuration Values'
                loading={loading}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={5.8}
          className='section-border'
          sx={(theme) => ({
            border: `1px solid ${theme.palette.common.black}`,
          })}
        >
          <Contractstable />
        </Grid>
        <Grid
          item
          xs={12}
          className='section-border'
          sx={(theme) => ({
            border: `1px solid ${theme.palette.common.black}`,
          })}
        >
          <DepartmentsTable />
        </Grid>
      </Grid> */}
    </>
  );
};

export default EmployeeInfo;
