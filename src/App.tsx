import './App.css'

import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Yaml from './tabs/Yaml';
import { DevfileContent } from './model/devfileContent';

function App() {

  // DEVFILE STATE
  const [devfile, setDevfile] = useState({} as DevfileContent)

  useEffect(() => {
    // TODO get devfile from API
  }, []);

  // TABS
  const tabNames: string[] = [
    "YAML",
    "Chart",
    "Metadata",
    "Commands",
    "Events",
    "Containers",
    "Images",
    "Resources",
    "Volumes"
  ];

  const [tabValue, setTabValue] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onYamlChange = (content: string) => {
    setDevfile({...devfile, content: content});
  }

  const onYamlClear = () => {
    setDevfile({...devfile, content: ""});
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Devfile Builder
            </Typography>
            <Button color="inherit">Save</Button>
          </Toolbar>
        </AppBar>
        <main>
          <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
            {tabNames.map(tabName => ( <Tab key={tabName} label={tabName} /> ))}
          </Tabs>
          <CustomTabPanel key="content-0" value={tabValue} index={0}>
            <Yaml 
              content={ devfile.content }
              onChange={ onYamlChange }
              onClear={ onYamlClear }
            />
          </CustomTabPanel>
          <CustomTabPanel key="content-1" value={tabValue} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel key="content-2" value={tabValue} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel key="content-3" value={tabValue} index={3}>
            Item 4
          </CustomTabPanel>
          <CustomTabPanel key="content-4" value={tabValue} index={4}>
            Item 5
          </CustomTabPanel>
          <CustomTabPanel key="content-5" value={tabValue} index={5}>
            Item 6
          </CustomTabPanel>
          <CustomTabPanel key="content-6" value={tabValue} index={6}>
            Item 7
          </CustomTabPanel>
          <CustomTabPanel key="content-7" value={tabValue} index={7}>
            Item 8
          </CustomTabPanel>
          <CustomTabPanel key="content-8" value={tabValue} index={8}>
            Item 9
          </CustomTabPanel>
        </main>
      </Box>
    </>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default App
