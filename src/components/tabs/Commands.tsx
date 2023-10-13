import { useState } from 'react';

import { List, ListItem, ListSubheader, ListItemText, Card, CardHeader, CardContent,Grid, FormControlLabel, Checkbox, Typography, CardActions, Button, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';

import { Command } from '../../model/command';
import { ExecCommand } from '../../model/execCommand';
import { ApplyCommand } from '../../model/applyCommand';
import { ImageCommand } from '../../model/imageCommand';
import { CompositeCommand } from '../../model/compositeCommand';
import AddCommand from '../fabs/AddCommand';
import AddExecCommand, { ExecCommandToCreate } from '../forms/AddExecCommand';
import AddApplyCommand, { ApplyCommandToCreate } from '../forms/AddApplyCommand';
import AddImageCommand, { ImageCommandToCreate } from '../forms/AddImageCommand';
import AddCompositeCommand, { CompositeCommandToCreate } from '../forms/AddCompositeCommand';


function Commands({
    commands, 
    resourceNames,
    imageNames,
    containerNames,
    volumesNames,
    onDefaultChange, 
    onDeleteCommand,
    onCreateExecCommand,
    onCreateApplyCommand,
    onCreateImageCommand,
    onCreateCompositeCommand,
    onMoveToGroup

}: {
    commands: Command[]
    resourceNames: string[],
    imageNames: string[],
    containerNames: string[],
    volumesNames: string[],
    onDefaultChange: (name: string, group: string, checked: boolean) => void,
    onDeleteCommand: (name: string) => void,
    onCreateExecCommand: (cmd: ExecCommandToCreate) => Promise<boolean>,
    onCreateApplyCommand: (cmd: ApplyCommandToCreate) => Promise<boolean>,
    onCreateImageCommand: (cmd: ImageCommandToCreate) => Promise<boolean>,
    onCreateCompositeCommand: (cmd: CompositeCommandToCreate) => Promise<boolean>,
    onMoveToGroup: (name: string, group: string) => void,
}) {
    
    const [commandToDisplay, setCommandToDisplay] = useState('');

    const handleAddCommand = (commandType: string) =>{
        setCommandToDisplay(commandType);
    }

    const handleCreateApplyCommand = (cmd: ApplyCommandToCreate) => {
        onCreateApplyCommand(cmd).then((success: boolean) => {
            if (success) {
                setCommandToDisplay('');
            }
        });
    }

    const handleCreateImageCommand = (cmd: ImageCommandToCreate) => {
        onCreateImageCommand(cmd).then((success: boolean) => {
            if (success) {
                setCommandToDisplay('');
            }
        });
    }

    const handleCreateCompositeCommand = (cmd: CompositeCommandToCreate) =>{
        onCreateCompositeCommand(cmd).then((success: boolean) => {
            if (success) {
                setCommandToDisplay('');
            }
        });
    }

    
    const handleCreateExecCommand = (cmd: ExecCommandToCreate) => {
        onCreateExecCommand(cmd).then((success: boolean) => {
            if (success) {
                setCommandToDisplay('');
            }
        });
    }

    return <>
        {commandToDisplay == '' && <Box sx={{textAlign: "right"}}>
            <AddCommand onAddCommand={handleAddCommand}/>
        </Box>}
        {commandToDisplay == '' && <CommandsList 
            commands={commands} 
            onDefaultChange={onDefaultChange} 
            onDeleteCommand={onDeleteCommand} 
            onMoveToGroup={onMoveToGroup}
        />}
        {commandToDisplay == 'exec' && <AddExecCommand 
            volumesNames={volumesNames}
            containerNames={containerNames}
            onCancel={() => setCommandToDisplay('')}
            onCreate={ handleCreateExecCommand }
        />}
        {commandToDisplay == 'apply' && <AddApplyCommand 
            resourceNames={resourceNames}
            onCancel={() => setCommandToDisplay('')}
            onCreate={ handleCreateApplyCommand }
        />}
        {commandToDisplay == 'image' && <AddImageCommand 
            imageNames={imageNames}
            onCancel={() => setCommandToDisplay('')}
            onCreate={ handleCreateImageCommand }
        />}
        {commandToDisplay == 'composite' && <AddCompositeCommand 
            commandsNames={commands.map(c => c.name)} 
            onCancel={() => setCommandToDisplay('')}
            onCreate={ handleCreateCompositeCommand }
        />}
    </>
}

function CommandsList({
    commands, 
    onDefaultChange, 
    onDeleteCommand,
    onMoveToGroup,
}: {
    commands: Command[];
    onDefaultChange: (name: string, group: string, checked: boolean) => void;
    onDeleteCommand: (name: string) => void;
    onMoveToGroup: (name: string, group: string) => void;
}) {
    const displayCommands = (group: string) => {
        const list = commands
        .filter((command: Command) => command.group == group);
        if (list.length == 0) {
            return <ListItem><ListItemText>No {group} commands yet. You can create a command then drag&drop it here</ListItemText></ListItem>
        }
        return list
            .map((c) => {
                return (
                    <ListItem key={`command-${c.name}`}>
                        <ListItemText>
                            <CommandItem
                                command={c}
                                onDefaultChange={(ch) => onDefaultChange(c.name, c.group, ch)}
                                onDeleteCommand={onDeleteCommand}
                                onMoveToGroup={onMoveToGroup}    
                            />
                        </ListItemText>
                    </ListItem>
                )
            });
    }
    return (
        <List>
            <ListSubheader>Build Commands</ListSubheader>
            { displayCommands('build') }                
            <ListSubheader>Run Commands</ListSubheader>
            { displayCommands('run') }
            <ListSubheader>Test Commands</ListSubheader>
            { displayCommands('test') }
            <ListSubheader>Debug Commands</ListSubheader>
            { displayCommands('debug') }
            <ListSubheader>Deploy Commands</ListSubheader>
            { displayCommands('deploy') }
            <ListSubheader>Generic Commands</ListSubheader>
            { displayCommands('') }
        </List>
    )
}


function CommandItem({
    command, 
    onDefaultChange,
    onDeleteCommand,
    onMoveToGroup,
}: {
    command: Command, 
    onDefaultChange: (checked: boolean) => void,
    onDeleteCommand: (name: string) => void,
    onMoveToGroup: (name: string, group: string) => void,
}) {
    return (
        <Card>
            <CommandHeader
                group={command.group}
                name={command.name}
                type={command.type}
                isDefault={command.default!} 
                onDefaultChange={onDefaultChange}
                onMoveToGroup={(group: string) => onMoveToGroup(command.name, group)}
            />
            <CardContent>            
                { command.type == 'exec' && <ExecCommandDetails command={command.exec!} /> }
                { command.type == 'apply' && <ApplyCommandDetails command={command.apply!} /> }
                { command.type == 'image' && <ImageCommandDetails command={command.image!} /> }
                { command.type == 'composite' && <CompositeCommandDetails command={command.composite!} /> }
            </CardContent>
            <CardActions>
                <Button color="error" onClick={() => onDeleteCommand(command.name)}>Delete</Button>
            </CardActions>
        </Card>
    )
}

function CommandHeader({
    name, 
    type, 
    group, 
    isDefault, 
    onDefaultChange,
    onMoveToGroup,
}: { 
    name: string, 
    type: string, 
    group: string, 
    isDefault: boolean,
    onDefaultChange: (checked: boolean) => void
    onMoveToGroup: (group: string) => void
}) {
    const [defaultChecked, setDefaultChecked] = useState(isDefault);

    const onChangeCheckbox = (e: any) => {
        setDefaultChecked(e.target.checked);
        onDefaultChange(e.target.checked);
    }

    return (
        <Grid container spacing={2}>
            <Grid key="header1" item xs={8}>
                <CardHeader
                    title={name}
                    subheader={`${type} command`}
                ></CardHeader>
            </Grid>
            <Grid key="header2" item xs={4}>
                <CardHeader                 
                    subheader={<>
                        {group != '' && <FormControlLabel control={<Checkbox checked={defaultChecked} onChange={onChangeCheckbox}/>} label={`Default ${group} command`} />}
                        <div><FormControl fullWidth variant="standard">
                                          <InputLabel>Move to Group</InputLabel>
                                          <Select
                                            label="Move to Group"
                                            value=""
                                            onChange={(e) => onMoveToGroup(e.target.value != '!' ? e.target.value : "")}
                                          >
                                            { ["build", "run", "test", "debug", "deploy"].filter(grp => grp != group).map(grp => {
                                                return <MenuItem key={grp} value={grp}>{grp}</MenuItem>
                                            })}
                                            {group != "" && <MenuItem key="generic" value="!">generic</MenuItem>}
                                          </Select>
                                        </FormControl></div>
                    </>}
                >                    
                </CardHeader>
            </Grid>
        </Grid>
    )
}

function ExecCommandDetails({command}: {command: ExecCommand}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="caption" component="div">Command Line</Typography>
                <code>{command.commandLine}</code>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="caption" component="div">Working Directory</Typography>
                <code>{command.workingDir}</code>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="caption" component="div">Hot Reload Capable</Typography>
                <code>{command.hotReloadCapable ? 'Yes' : 'No'}</code>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="caption" component="div">Container</Typography>
                <code>{command.component}</code>
            </Grid>
        </Grid>
    )
}

function ApplyCommandDetails({command}: {command: ApplyCommand}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="caption" component="div">Cluster Resource</Typography>
                <code>{command.component}</code>
            </Grid>

        </Grid>
    )
}

function ImageCommandDetails({command}: {command: ImageCommand}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="caption" component="div">Image</Typography>
                <code>{command.component}</code>
            </Grid>

        </Grid>
    )
}

function CompositeCommandDetails({command}: {command: CompositeCommand}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="caption" component="div">Scheduling</Typography>
                <code>{command.parallel ? 'Commands executed in parallel' : 'Commands executed serially' }</code>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" component="div">Commands</Typography>
                <code>{command.commands.join(', ')}</code>
            </Grid>
        </Grid>
    )
}

export default Commands;
