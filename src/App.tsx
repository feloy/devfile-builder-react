import './App.css'

import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function App() {

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

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {tabNames.map(tabName => ( <Tab label={tabName} /> ))}
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            Item One
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Item 4
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            Item 5
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            Item 6
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            Item 7
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            Item 8
          </CustomTabPanel>
          <CustomTabPanel value={value} index={8}>
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default App
