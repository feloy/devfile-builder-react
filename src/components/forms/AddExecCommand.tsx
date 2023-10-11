import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { commandIdPatternRegex } from "./consts";
import { ExecCommand } from "../../model/execCommand";
import { Container } from "../../model/container";

export interface ExecCommandToCreate {
    name: string,
    execCmd: ExecCommand,
    containers: Container[]
}

interface FormValue {
    name: string;
    commandLine: string;
    workingDir: string;
    component: string;
    hotReloadCapable: boolean;
}

interface Invalid {
    nameField?: boolean
    commandlineField?: boolean
    workingdirField?: boolean
}

function AddExecCommand({
    containerNames,
    onCancel,
    onCreate
}: {
    containerNames: string[],
    onCancel: () => void,
    onCreate: (cmd: ExecCommandToCreate) => void

}) {
    const [ commandValue, setCommandValue ] = useState<FormValue>({name: "", commandLine: "", workingDir: "", component: "", hotReloadCapable: false});
    const [ containerNamesList, setContainerNamesList ] = useState(containerNames);

    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }
    const computeInvalid = (value: FormValue): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(value.name)) {
            inv.nameField = true;
        }
        if (!isCommandlineValid(value.commandLine)) {
            inv.commandlineField = true;
        }
        if (!isWorkingdirValid(value.workingDir)) {
            inv.workingdirField = true;
        }
        return inv;
    }

    useEffect(() => {
        setInvalid(computeInvalid(commandValue));
    }, [commandValue]);

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return commandIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-exec-command');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...commandValue, name: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    // Command Line validation
    const [commandlineErrorMsg, setCommandlineErrorMsg] = useState('');
    const isCommandlineValid = (v: string): boolean => {
        return v != "";
    }
    const updateCommandlineErrorMsg = (valid: boolean) => {
        setCommandlineErrorMsg(valid ? '' : 'Command Line is required');
    }
    const onCommandlineChange = (v: string) => {
        const valid = isCommandlineValid(v)
        updateCommandlineErrorMsg(valid);
        const newValue = {...commandValue, commandLine: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    // Working dir validation
    const [workingdirErrorMsg, setWorkingdirErrorMsg] = useState('');
    const isWorkingdirValid = (v: string): boolean => {
        return v != "";
    }
    const updateWorkingdirErrorMsg = (valid: boolean) => {
        setWorkingdirErrorMsg(valid ? '' : 'Working directory is required');
    }
    const onWorkingdirChange = (v: string) => {
        const valid = isWorkingdirValid(v)
        updateWorkingdirErrorMsg(valid);
        const newValue = {...commandValue, workingDir: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const onRootdirClick = () => {
        const v = "${PROJECTS_ROOT}";
        const valid = isWorkingdirValid(v)
        updateWorkingdirErrorMsg(valid);
        const newValue = {...commandValue, workingDir: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const onHotreloadChange = (c: boolean) => {
        const newValue = {...commandValue, hotReloadCapable: c};
        setCommandValue(newValue);
    }

    // Container validation
    const [containerErrorMsg, setContainerErrorMsg] = useState('');
    const isContainerValid = (v: string): boolean => {
        return v != "";
    }
    const updateContainerErrorMsg = (valid: boolean) => {
        setContainerErrorMsg(valid ? '' : 'Container is required');
    }
    const onContainerChange = (v: string) => {
        const valid = isContainerValid(v)
        updateContainerErrorMsg(valid);
        const newValue = {...commandValue, component: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const handleCreate = () => {
        const {name, ...execCmd} = commandValue;
        const containers: Container[] = [];
        //if (newContainertoCreate !== undefined) {
        //    images.push(newImagetoCreate);
        //}
        onCreate({
            name,
            execCmd,
            containers
        });
    }

    return (
        <Card>
            <CardHeader 
                title="Add an Exec Command"
                subheader="An Exec command is a shell command executed into a container."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            placeholder="Unique name to identify the command"
                            value={commandValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Command Line *" fullWidth
                            placeholder="Command Line passed to the shell"
                            value={commandValue.commandLine}
                            onChange={(e) => onCommandlineChange(e.target.value)}
                            onBlur={(e) => onCommandlineChange(e.target.value)}
                            helperText={commandlineErrorMsg}
                            error={!!commandlineErrorMsg}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Working Directory *" fullWidth
                            placeholder="Working directory of the command"
                            value={commandValue.workingDir}
                            onChange={(e) => onWorkingdirChange(e.target.value)}
                            onBlur={(e) => onWorkingdirChange(e.target.value)}
                            helperText={workingdirErrorMsg}
                            error={!!workingdirErrorMsg}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={onRootdirClick}>Work on Project's Root Directory</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth 
                            error={!!containerErrorMsg}
                        >
                            <InputLabel>Container *</InputLabel>
                            <Select
                                label="Container *"
                                value={commandValue.component}
                                onChange={(e) => onContainerChange(e.target.value)}
                                onBlur={(e) => onContainerChange(e.target.value)}
                            >
                                {containerNamesList.map(containerName => <MenuItem key={`container-${containerName}`} value={containerName}>{containerName}</MenuItem>)}
                                <MenuItem key="container-!" value="!">(new container)</MenuItem>
                            </Select>
                            <FormHelperText>{containerErrorMsg}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Hot Reload Capable"
                            checked={commandValue.hotReloadCapable}
                            onChange={(_, checked: boolean) => onHotreloadChange(checked)}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )

}

export default AddExecCommand;
