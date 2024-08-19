import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

function CustomTabPanel(props: any) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        maxHeight: '500px',
        overflowY: 'auto',
        ...sx,
      }}
    >
      {value === index && (
        <Box sx={{ py: '6px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  tabs,
  tabPanels,
  sx = {},
  customTabPanelSx = {},
}: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 'auto' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          sx={{
            '.MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            ...sx,
          }}
        >
          {tabs.map((tab: any, i: any) => (
            <Tab label={t(tab)} {...a11yProps(i)} key={i} />
          ))}
        </Tabs>
      </Box>
      {tabPanels.map((tabPanel: any, i: any) => (
        <CustomTabPanel
          value={value}
          index={i}
          key={i}
          sx={{
            ...customTabPanelSx,
            maxHeight: '100%',
          }}
        >
          {tabPanel}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
