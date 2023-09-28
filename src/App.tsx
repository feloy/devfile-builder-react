import './App.css'

import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Yaml from './components/tabs/Yaml';
import { DevfileContent } from './model/devfileContent';
import { setDevfileContent } from './services/devstate';
import { getDevfile as getDevfileFromApi } from './services/api';

function App() {

  // DEVFILE STATE
  const [devfile, setDevfile] = useState({} as DevfileContent)

  // Load devfile from API at startup, then set it into devstate
  useEffect(() => {
    getDevfileFromApi().then((c) => {
      setDevfileContent(c.data.content || '').then((d) => {
        setDevfile(d.data);
      });
    });
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
            Chart
          </CustomTabPanel>
          <CustomTabPanel key="content-2" value={tabValue} index={2}>
            <pre>{JSON.stringify(devfile.metadata, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-3" value={tabValue} index={3}>
            <pre>{JSON.stringify(devfile.commands, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-4" value={tabValue} index={4}>
            <pre>{JSON.stringify(devfile.events, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-5" value={tabValue} index={5}>
            <pre>{JSON.stringify(devfile.containers, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-6" value={tabValue} index={6}>
            <pre>{JSON.stringify(devfile.images, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-7" value={tabValue} index={7}>
            <pre>{JSON.stringify(devfile.resources, null, 2)}</pre>
          </CustomTabPanel>
          <CustomTabPanel key="content-8" value={tabValue} index={8}>
            <pre>{JSON.stringify(devfile.volumes, null, 2)}</pre>
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
