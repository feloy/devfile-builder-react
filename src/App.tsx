import './App.css'

import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Yaml from './components/tabs/Yaml';
import MetadataForm from './components/tabs/MetadataForm';
import Commands from './components/tabs/Commands';

import { DevfileContent } from './model/devfileContent';
import { Metadata } from './model/metadata';

import { 
  setDevfileContent, 
  setMetadata, 
  setDefaultCommand, 
  unsetDefaultCommand,
  deleteCommand,
  deleteResource,
  addResource,
  saveResource,
  addApplyCommand,
  deleteImage,
  addImage,
  saveImage,
  addCompositeCommand,
  updateEvents,
  addVolume,
  saveVolume,
  deleteVolume,
  deleteContainer,
  saveContainer,
  addContainer,
  addExecCommand,
  moveCommand,
  updateApplyCommand,
  updateExecCommand,
  updateCompositeCommand
} from './services/devstate';

import { getDevfile as getDevfileFromApi } from './services/api';
import { GeneralError } from './model/generalError';
import Resources from './components/tabs/Resources';
import { Resource } from './model/resource';
import { ApplyCommandToCreate } from './components/forms/AddApplyCommand';
import Images from './components/tabs/Images';
import { Image } from './model/image';
import { ImageCommandToCreate } from './components/forms/AddImageCommand';
import { CompositeCommandToCreate } from './components/forms/AddCompositeCommand';
import EventsForm from './components/tabs/EventsForm';
import Volumes from './components/tabs/Volumes';
import { Volume } from './model/volume';
import Containers from './components/tabs/Containers';
import { Container } from './model/container';
import { ExecCommandToCreate } from './components/forms/AddExecCommand';

export const App = () => {

  // DEVFILE STATE
  const [devfile, setDevfile] = useState({} as DevfileContent)

  /**
   *  Load devfile from API at startup, then set it into devstate
   */
  useEffect(() => {
    getDevfileFromApi().then((c) => {
      setDevfileContent(c.data.content || '').then((d) => {
        setDevfile(d.data);
      }).catch((error: AxiosError) => {
        displayError(error);
      });
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }, []);

  // TABS
  const tabNames: string[] = [
    "YAML",
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

  /**
   * Called when the content of the YAML textarea is applied
   * 
   * @param content Devfile YAML content
   */
  const onYamlApply = (content: string) => {
    sendDevfileContentToDevstate(content);
  }

  /**
   * Called when the Clear button of the YAML textarea is clicked
   */
  const onYamlClear = () => {
    const newContent = "schemaVersion: 2.2.0";
    sendDevfileContentToDevstate(newContent);
  }

  /**
   * Called when the Apply button on the Metadata tab is clicked
   */
  const onMetadataApply = (metadata: Metadata) => {
    setMetadata(metadata).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Called when a "Default <group> command" button on a Command has been clicked
   * 
   * @param name name of the command
   * @param group group to which the command is affected
   * @param checked is the command the default command of the group?
   */
  const onDefaultChange = (name: string, group: string, checked: boolean) => {
    var cmd;
    if (checked) {
      cmd = setDefaultCommand;
    } else {
      cmd = unsetDefaultCommand;
    }
    cmd(name, group).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  };

  /**
   * Delete a command
   * 
   * @param name name of the command to delete
   */
  const onDeleteCommand = (name: string) => {
    if(!confirm('You will delete the command "'+name+'". Continue?')) {
      return;
    }
    deleteCommand(name).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Create a new Exec command
   * 
   * @param cmd the Execcommand to create, and the related container if needed
   * @returns 
   */
  const onCreateExecCommand = (cmd: ExecCommandToCreate): Promise<boolean> => {
    const doCreateCommand = (): Promise<boolean> => {
      return addExecCommand(cmd.name, cmd.execCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.containers.length > 0) {
      const containerToCreate = cmd.containers[0];
      return addContainer(containerToCreate).then(_ => {
        return doCreateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doCreateCommand();
    }
  }

  /**
   * Update an Exec command
   * 
   * @param cmd the Exec command to update, and the related container if needed
   * @returns 
   */
  const onSaveExecCommand = (cmd: ExecCommandToCreate): Promise<boolean> => {
    const doUpdateCommand = (): Promise<boolean> => {
      return updateExecCommand(cmd.name, cmd.execCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.containers.length > 0) {
      const containerToCreate = cmd.containers[0];
      return addContainer(containerToCreate).then(_ => {
        return doUpdateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doUpdateCommand();
    }
  }

  /**
   * Create a new Apply Command
   * 
   * @param cmd the Apply command to create, and the related resource if needed
   */
  const onCreateApplyCommand = (cmd: ApplyCommandToCreate): Promise<boolean> => {
    const doCreateCommand = (): Promise<boolean> => {
      return addApplyCommand(cmd.name, cmd.applyCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.resources.length > 0) {
      const resourceToCreate = cmd.resources[0];
      return addResource(resourceToCreate).then(_ => {
        return doCreateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doCreateCommand();
    }
  }

  /**
   * Update an Apply Command
   * 
   * @param cmd the Apply command to update, and the related resource if needed
   */
  const onSaveApplyCommand = (cmd: ApplyCommandToCreate): Promise<boolean> => {
    const doUpdateCommand = (): Promise<boolean> => {
      return updateApplyCommand(cmd.name, cmd.applyCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.resources.length > 0) {
      const resourceToCreate = cmd.resources[0];
      return addResource(resourceToCreate).then(_ => {
        return doUpdateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doUpdateCommand();
    }
  }


  /**
   * Create a new Image command
   * 
   * @param cmd the Image command to create, and the related image if needed
   */
  const onCreateImageCommand = (cmd: ImageCommandToCreate): Promise<boolean> => {
    const doCreateCommand = (): Promise<boolean> => {
      return addApplyCommand(cmd.name, cmd.imageCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.images.length > 0) {
      const imageToCreate = cmd.images[0];
      return addImage(imageToCreate).then(_ => {
        return doCreateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doCreateCommand();
    }
  }

  /**
   * Update an Image command
   * 
   * @param cmd the Image command to update, and the related image if needed
   */
  const onSaveImageCommand = (cmd: ImageCommandToCreate): Promise<boolean> => {
    const doUpdateCommand = (): Promise<boolean> => {
      return updateApplyCommand(cmd.name, cmd.imageCmd).then(d => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    }

    if (cmd.images.length > 0) {
      const imageToCreate = cmd.images[0];
      return addImage(imageToCreate).then(_ => {
        return doUpdateCommand();
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    } else {
      return doUpdateCommand();
    }
  }

  /**
   * Create a new Composite command
   * 
   * @param cmd the Composite command to create
   */
  const onCreateCompositeCommand = (cmd: CompositeCommandToCreate): Promise<boolean> => {
    return addCompositeCommand(cmd.name, cmd.compositeCmd).then(d => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Update a new Composite command
   * 
   * @param cmd the Composite command to update
   */
  const onSaveCompositeCommand = (cmd: CompositeCommandToCreate): Promise<boolean> => {
    return updateCompositeCommand(cmd.name, cmd.compositeCmd).then(d => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Delete a cluster resource
   * 
   * @param name  name of the cluster resource to delete
   * @returns 
   */
  const onDeleteResource = (name: string) => {
    if(!confirm('You will delete the resource "'+name+'". Continue?')) {
      return;
    }
    deleteResource(name).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Create a cluster resource
   * 
   * @param resource resource to create
   * @returns A promise to true when the resource has been saved correctly
   */
  const onCreateResource = (resource: Resource): Promise<boolean> => {
    return addResource(resource).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Update a resource
   * @param resource resource to update 
   * @returns A promise to true when the resource has been saved correctly
   */
  const onSaveResource = (resource: Resource): Promise<boolean> => {
    return saveResource(resource).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Delete an Image
   * 
   * @param name name of the image to delete
   */
  const onDeleteImage = (name: string) => {
    if(!confirm('You will delete the image "'+name+'". Continue?')) {
      return;
    }
    deleteImage(name).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Create a new image
   * 
   * @param image image to add to the Devfile
   */
  const onCreateImage = (image: Image): Promise<boolean> => {
    return addImage(image).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Update an Image
   * 
   * @param image image to save
   */
  const onSaveImage = (image: Image): Promise<boolean> => {
    return saveImage(image).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }


  /**
   * Delete a Volume
   * 
   * @param name name of the volume to delete
   */
  const onDeleteVolume = (name: string) => {
    if(!confirm('You will delete the volume "'+name+'". Continue?')) {
      return;
    }
    deleteVolume(name).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Add a new volume
   * 
   * @param volume volume information
   */
  const onCreateVolume = (volume: Volume): Promise<boolean> => {
    return addVolume(volume).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Update an existing volume
   * 
   * @param volume volume information
   */
  const onSaveVolume = (volume: Volume): Promise<boolean> => {
    return saveVolume(volume).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Update events for the specified type
   * 
   * @param eventType type of the event to update
   * @param commands list of commands for the event type
   */
  const handleEventChange = (eventType: "preStart" | "postStart" | "preStop" | "postStop", commands: string[]) => {
    return updateEvents(eventType, commands).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });
  }

  /**
   * Delete a Container
   * 
   * @param name name of the container to delete
   */
  const onDeleteContainer = (name: string) => {
    if(!confirm('You will delete the container "'+name+'". Continue?')) {
      return;
    }
    deleteContainer(name).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });
  }

  /**
   * Add a new container
   * 
   * @param container container information
   */
  const onCreateContainer = (container: Container, volumesToCreate: Volume[]): Promise<boolean> => {
    return createVolumes(volumesToCreate, 0, () => {
      return addContainer(container).then((d) => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });
    });
  }

  /**
   * Update an existing container
   * 
   * @param container container information
   */
  const onSaveContainer = (container: Container, volumesToCreate: Volume[]): Promise<boolean> => {
    return createVolumes(volumesToCreate, 0, () => {
      return saveContainer(container).then((d) => {
        setDevfile(d.data);
        return true;
      }).catch((error: AxiosError) => {
        displayError(error);
        return false;
      });  
    });
  }
  
  const createVolumes = (volumes: Volume[], i: number, next: () => any): Promise<boolean> => {
    if (volumes.length == i) {
      return next();
    }
    return addVolume(volumes[i]).then(() => {
      return createVolumes(volumes, i+1, next);
    }).catch((error: AxiosError) => {
      alert(error.message);
      return false;
    });
  }

  const onMoveToGroup = (commandName: string, newGroup: string) => {
    const oldGroup = devfile.commands.filter(cmd => cmd.name == commandName)[0].group;
    const oldIndex = devfile.commands.filter(cmd => cmd.group == oldGroup).findIndex(c => c.name == commandName);
    const newIndex = devfile.commands.filter(cmd => cmd.group == newGroup).length;
    return moveCommand(oldGroup, newGroup, oldIndex, newIndex).then((d) => {
      setDevfile(d.data);
      return true;
    }).catch((error: AxiosError) => {
      displayError(error);
      return false;
    });  
}

  // UTILITY FUNCTIONS

  /**
   * Send the new Devfile content to the Devstate, and sets
   * the new received Devfile state in the local state
   *
   * @param (string) content Devfile content
   */
  function sendDevfileContentToDevstate(content: string) {
    setDevfileContent(content).then((d) => {
      setDevfile(d.data);
    }).catch((error: AxiosError) => {
      displayError(error);
    });  
  }

  function displayError(error: AxiosError) {
    if (error.response) {
      alert((error.response.data as GeneralError).message);
    } else {
      alert(error.message);
    }
  }

  return (
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
              onApply={ onYamlApply }
              onClear={ onYamlClear }
            />
          </CustomTabPanel>

          <CustomTabPanel key="content-1" value={tabValue} index={1}>
            <MetadataForm metadata={devfile.metadata} onApply={ onMetadataApply } />
          </CustomTabPanel>

          <CustomTabPanel key="content-2" value={tabValue} index={2}>
            <Commands
              commands={devfile.commands}
              resourceNames={devfile.resources?.map(r => r.name)}
              imageNames={devfile.images?.map(i => i.name)}
              containerNames={devfile.containers?.map(i => i.name)}
              volumesNames={devfile.volumes?.map(i => i.name)}
              onDefaultChange={onDefaultChange}
              onDeleteCommand={onDeleteCommand}
              onCreateExecCommand={onCreateExecCommand}
              onSaveExecCommand={onSaveExecCommand}
              onCreateApplyCommand={onCreateApplyCommand}
              onSaveApplyCommand={onSaveApplyCommand}
              onCreateImageCommand={onCreateImageCommand}
              onSaveImageCommand={onSaveImageCommand}
              onCreateCompositeCommand={onCreateCompositeCommand}
              onSaveCompositeCommand={onSaveCompositeCommand}
              onMoveToGroup={onMoveToGroup}
            />
          </CustomTabPanel>

          <CustomTabPanel key="content-3" value={tabValue} index={3}>
            <EventsForm
              commandsNames={devfile.commands?.map(c => c.name)}
              value={devfile.events}
              onChange={ handleEventChange }
             />
          </CustomTabPanel>
          
          <CustomTabPanel key="content-4" value={tabValue} index={4}>
            <Containers 
              volumesNames={devfile.volumes?.map(v => v.name)}
              containers={devfile.containers}
              onDeleteContainer={onDeleteContainer}
              onCreateContainer={onCreateContainer}
              onSaveContainer={onSaveContainer}
              />
          </CustomTabPanel>

          <CustomTabPanel key="content-5" value={tabValue} index={5}>
            <Images
              images={devfile.images}
              onDeleteImage={onDeleteImage}
              onCreateImage={onCreateImage}
              onSaveImage={onSaveImage}
            />
          </CustomTabPanel>
          
          <CustomTabPanel key="content-6" value={tabValue} index={6}>
            <Resources
              resources={devfile.resources}
              onDeleteResource={onDeleteResource}
              onCreateResource={onCreateResource}
              onSaveResource={onSaveResource}
            />
          </CustomTabPanel>
          
          <CustomTabPanel key="content-7" value={tabValue} index={7}>
          <Volumes
              volumes={devfile.volumes}
              onDeleteVolume={onDeleteVolume}
              onCreateVolume={onCreateVolume}
              onSaveVolume={onSaveVolume}
            />
          </CustomTabPanel>
        </main>
      </Box>
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
