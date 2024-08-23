import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import EditAndSave from '../Global/EditAndSave';
import EditFieldsModal from '../Global/EditFieldsModal';
import { useTranslation } from 'react-i18next';

interface Configuration {
  id: number;
  title: string;
  value: string;
}

interface SkillExpertiseState {
  id: number;
  value: string;
}

interface SkillAchievementState {
  id: number;
  title: string;
  value: number;
}

interface InfoCardsProps {
  values: Configuration[] | SkillExpertiseState[] | SkillAchievementState[];
  // eslint-disable-next-line
  onSave: any;
  title: string;
  loading: boolean;
  twoTier?: boolean;
  title2?: string;
  addAndDelete?: boolean;
  saveOnTop?: boolean;
  mainTitle?: string;
  numberLimit?: number;
}

const InfoCards = ({
  values,
  onSave,
  title,
  loading,
  twoTier = false,
  title2,
  addAndDelete = true,
  saveOnTop = false,
  mainTitle = '',
  numberLimit = 0,
}: InfoCardsProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='space-between'
        mb={1}
        pb={1}
      >
        {title2 && (
          <Typography fontSize={14} color={'#092C4C'} sx={{ opacity: '0.7' }}>
            {title2}
          </Typography>
        )}
        <Typography fontSize={14} color={'#092C4C'} sx={{ opacity: '0.7' }}>
          {title}
        </Typography>
        {saveOnTop && (
          <EditAndSave
            showConfirm={false}
            setEdit={() => {
              setOpen(true);
            }}
          />
        )}
      </Stack>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack
          direction='column'
          spacing={2}
          sx={{
            mr: twoTier && !saveOnTop ? 15 : '0px',
          }}
        >
          {values.map((value: Configuration | SkillExpertiseState | SkillAchievementState) => {
            if ('title' in value) {
              return (
                <Stack
                  direction={twoTier ? 'row' : 'column'}
                  spacing={2}
                  sx={{
                    borderBottom: '1px solid #E5E5E5',
                    paddingBottom: '10px',
                    columnGap: twoTier ? { xl: '20%', lg: '8%', md: '23%', sm: '25%' } : ''
                  }}
                >
                  {twoTier && (
                    <Typography
                      key={value.id}
                      my={2}
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        width: '132px'
                      }}
                    >
                      {t(value.title)}
                    </Typography>
                  )}
                  <Typography
                    key={value.id}
                    my={2}
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {t(value.value.toString())}
                  </Typography>
                </Stack>
              );
            } else {
              return (
                <Stack
                  direction={twoTier ? 'row' : 'column'}
                  spacing={2}
                  sx={{
                    borderBottom: '1px solid #E5E5E5',
                    paddingBottom: '10px',
                    columnGap: twoTier ? { xl: '20%', lg: '8%', md: '23%', sm: '25%' } : ''
                  }}
                >
                  <Typography
                    key={value.id}
                    my={2}
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {t(value.value)}
                  </Typography>
                </Stack>
              );
            }
          })}
        </Stack>
      )}

      <EditFieldsModal
        fields={values}
        open={open}
        handleClose={toggleModal}
        onSave={onSave}
        title={`Update ${mainTitle || title}`}
        twoTier={twoTier}
        addAndDelete={addAndDelete}
        isKeyValue={saveOnTop && twoTier}
        numberLimit={numberLimit}
      />
    </Box>
  );
};

export default InfoCards;
