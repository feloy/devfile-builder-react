import { useState } from 'react';

import { List, ListItem, ListSubheader, ListItemText, Card, CardHeader, CardContent,Grid, FormControlLabel, Checkbox, Typography, CardActions, Button, Box } from '@mui/material';

import { Command } from '../../model/command';
import { ExecCommand } from '../../model/execCommand';
import { ApplyCommand } from '../../model/applyCommand';
import { ImageCommand } from '../../model/imageCommand';
import { CompositeCommand } from '../../model/compositeCommand';
import AddCommand from '../fabs/AddCommand';
import AddExecCommand from '../forms/AddExecCommand';
import AddApplyCommand from '../forms/AddApplyCommand';
import AddImageCommand from '../forms/AddImageCommand';
import AddCompositeCommand from '../forms/AddCompositeCommand';


function Commands({
    commands, 
    onDefaultChange, 
    onDeleteCommand
}: {
    commands: Command[];
    onDefaultChange: (name: string, group: string, checked: boolean) => void;
    onDeleteCommand: (name: string) => void;
}) {
    
    const [commandToDisplay, setCommandToDisplay] = useState('');

    const handleAddCommand = (commandType: string) =>{
        setCommandToDisplay(commandType);
    }

    return <>
        <Box sx={{textAlign: "right"}}>
            <AddCommand onAddCommand={handleAddCommand}/>
        </Box>
        <CommandsList 
            display={commandToDisplay == ''}
            commands={commands} 
            onDefaultChange={onDefaultChange} 
            onDeleteCommand={onDeleteCommand} 
        />
        <AddExecCommand 
            display={commandToDisplay == 'exec'}
            onCancel={() => setCommandToDisplay('')}
        />
        <AddApplyCommand 
            display={commandToDisplay == 'apply'}
            onCancel={() => setCommandToDisplay('')}
        />
        <AddImageCommand 
            display={commandToDisplay == 'image'}
            onCancel={() => setCommandToDisplay('')}
        />
        <AddCompositeCommand 
            display={commandToDisplay == 'composite'}
            onCancel={() => setCommandToDisplay('')}
        />
    </>
}

function CommandsList({
    display,
    commands, 
    onDefaultChange, 
    onDeleteCommand
}: {
    display: boolean,
    commands: Command[];
    onDefaultChange: (name: string, group: string, checked: boolean) => void;
    onDeleteCommand: (name: string) => void;
}) {
    if (!display) {
        return <div></div>
    }

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
                                onDeleteCommand={onDeleteCommand}/>
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
    onDeleteCommand
}: {
    command: Command, 
    onDefaultChange: (checked: boolean) => void,
    onDeleteCommand: (name: string) => void
}) {
    return (
        <Card>
            <CommandHeader
                group={command.group}
                name={command.name}
                type={command.type}
                isDefault={command.default!} 
                onDefaultChange={onDefaultChange}    
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

function CommandHeader({name, type, group, isDefault, onDefaultChange}: { name: string, type: string, group: string, isDefault: boolean,onDefaultChange: (checked: boolean) => void}) {    
    const [defaultChecked, setDefaultChecked] = useState(isDefault);

    const onChangeCheckbox = (e: any) => {
        setDefaultChecked(e.target.checked);
        onDefaultChange(e.target.checked);
    }
    if (group == '') {
        return (
            <CardHeader
                title={name}
                subheader={`${type} command`}
            ></CardHeader>
        )
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
                <CardHeader subheader={<FormControlLabel control={<Checkbox checked={defaultChecked} onChange={onChangeCheckbox}/>} label={`Default ${group} command`} />}></CardHeader>
            </Grid>
        </Grid>
    )
}

function ExecCommandDetails({command}: {command: ExecCommand}) {
    return <pre>{ JSON.stringify(command, null, 2) }</pre>
}

function ApplyCommandDetails({command}: {command: ApplyCommand}) {
    return <pre>{ JSON.stringify(command, null, 2) }</pre>
}

function ImageCommandDetails({command}: {command: ImageCommand}) {
    return <pre>{ JSON.stringify(command, null, 2) }</pre>
}

function CompositeCommandDetails({command}: {command: CompositeCommand}) {
    return <pre>{ JSON.stringify(command, null, 2) }</pre>
}

export default Commands;
