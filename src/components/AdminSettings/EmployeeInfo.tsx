import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import jwtInterceoptor from '../../services/interceptors';
import Contractstable from './Contractstable';
import { useSnackbar } from '../Global/WithSnackbar';
import DepartmentsTable from './DepartmentsTable';
import InfoCards from './InfoCards';
import { useTranslation } from 'react-i18next';
import Gendertable from './Genderstable';
import { AxiosError, AxiosResponse } from 'axios';

interface ConfigurationState {
  key: string;
  value: string;
}

interface Configuration {
  id: number;
  title: string;
  value: string;
}

interface Snackbar {
  // eslint-disable-next-line
  showMessage: (message: string, variant: 'error' | 'success' | 'info' | 'warning') => void;
}

interface ConfigSaveProps {
  updatedFields: Configuration[];
  newFields: Configuration[];
  removedFields: Configuration[];
}

const EmployeeInfo: React.FC = () => {
  const [configData, setConfigData] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showMessage }: Snackbar = useSnackbar() as Snackbar;

  const GetAllConfigurationValue = () => {
    setLoading(true);
    // eslint-disable-next-line
    jwtInterceoptor
      .get('api/ConfigurationValues/GetAllConfigurationValue')
      .then((res: AxiosResponse<ConfigurationState[]>) => {
        setConfigData(
          res.data.map((item: ConfigurationState, i: number) => ({
            id: i * 2,
            value: item.value,
            title: item.key,
          }))
        );

        setLoading(false);
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
  };

  useEffect(() => {
    GetAllConfigurationValue();
  }, []);

  const updateConfig = (data: Configuration) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/ConfigurationValues/Update', {
        key: data.title,
        value: data.value,
      })
      .then(() => {
        GetAllConfigurationValue();
        showMessage('Updated Configuration data', 'success');
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

  const addConfig = (data: Configuration) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .post('api/ConfigurationValues/Create', {
        key: data.title,
        value: data.value,
      })
      .then(() => {
        GetAllConfigurationValue();
        showMessage('Added Configuration data', 'success');
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

  const deleteConfig = (data: Configuration) => {
    // eslint-disable-next-line
    jwtInterceoptor
      .delete(`api/ConfigurationValues/Delete?key=${data.title}`)
      .then(() => {
        GetAllConfigurationValue();
        showMessage('Deleted Configuration data', 'success');
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

  const onConfigSave = ({
    updatedFields,
    newFields,
    removedFields,
  }: ConfigSaveProps) => {
    newFields.forEach((item: Configuration) => {
      addConfig(item);
    });
    updatedFields.forEach((item: Configuration) => {
      updateConfig(item);
    });
    removedFields.forEach((item: Configuration) => {
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
        justifyContent='space-between'
      >
        <Grid
          item
          md={7}
          xs={12}
          className='section-border'
          sx={() => ({
            padding: 0,
          })}
        >
          <h3>{t('General Settings')}</h3>
          <Gendertable />
          <Contractstable />
        </Grid>

        <Grid
          item
          md={5}
          xs={12}
          className='section-border'
          sx={() => ({
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
    </>
  );
};

export default EmployeeInfo;
