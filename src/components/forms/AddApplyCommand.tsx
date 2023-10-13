import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddResourceForm from "./AddResourceForm";
import { emptyResource } from "../tabs/Resources";
import { Resource } from "../../model/resource";
import { ApplyCommand } from "../../model/applyCommand";
import { commandIdPatternRegex } from "./consts";
import { Command } from "../../model/command";

export interface ApplyCommandToCreate {
    name: string,
    applyCmd: ApplyCommand,
    resources: Resource[]
}

interface Invalid {
    nameField?: boolean
    resourceField?: boolean
}

interface FormValue {
    name: string;
    component: string;
}

function AddApplyCommand({
    command,
    resourceNames,
    onCancel,
    onCreate,
    onSave,
}: {
    command: Command,
    resourceNames: string[],
    onCancel: () => void,
    onCreate: (cmd: ApplyCommandToCreate) => void
    onSave: (cmd: ApplyCommandToCreate) => void
}) {
    const [ commandValue, setCommandValue] = useState<FormValue>({name: "", component: ""});
    const [ showNewResource, setShowNewResource ] = useState(false);
    const [ resourceNamesList, setResourceNamesList ] = useState(resourceNames);
    const [ newResourcetoCreate, setNewResourceToCreate] = useState<Resource | undefined>(undefined);
    const [editing, setEditing] = useState(command.name !== '');

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
        if (!isResourceValid(value.component)) {
            inv.resourceField = true;
        }
        return inv;
    }

    useEffect(() => {
        setInvalid(computeInvalid(commandValue));
    }, [commandValue]);

    useEffect(() => {
        setCommandValue({name: command.name, component: command.apply?.component ?? ''});
        setEditing(command.name != '');
    }, [command]);

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return commandIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-apply-command');
    }

    // Resource validation
    const [resourceErrorMsg, setResourceErrorMsg] = useState('');
    const isResourceValid = (v: string): boolean => {
        return v != '' && v != '!';
    }
    const updateResourceErrorMsg = (valid: boolean) => {
        setResourceErrorMsg(valid ? '' : 'A Resource must be selected');
    }

    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...commandValue, name: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const onResourceChange = (v: string) => {
        const valid = isResourceValid(v)
        updateResourceErrorMsg(valid);
        setShowNewResource(v == "!");
        const newValue = {...commandValue, component: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const handleClick = () => {
        const {name, ...applyCmd} = commandValue;
        const resources = [];
        if (newResourcetoCreate !== undefined) {
            resources.push(newResourcetoCreate);
        }
        if (editing) {
            onSave({
                name,
                applyCmd,
                resources
            });
        } else {
            onCreate({
                name,
                applyCmd,
                resources
            });
        }
    }

    // New resource
    const onNewResourceCancel = () => {
        setShowNewResource(false);
        const newValue = {...commandValue, component: ''};
        setCommandValue(newValue);
    }

    const onNewResourceCreate = (resource: Resource) => {        
        setNewResourceToCreate(resource);
        setResourceNamesList([...resourceNamesList, resource.name]);
        onResourceChange(resource.name);
    }

    return (
        <Card>
            <CardHeader
                title={editing ? `Edit the Apply command "${command.name}"` : 'Add an Apply Command'}
                subheader="An Apply command applies a resource to the cluster. Equivalent to kubectl apply -f ..."></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            placeholder="Unique name to identify the command"
                            disabled={editing}
                            value={commandValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl 
                            fullWidth 
                            error={!!resourceErrorMsg}
                        >
                            <InputLabel>Resource *</InputLabel>
                            <Select                                
                                label="Resource *"
                                value={commandValue.component}
                                onChange={(e) => onResourceChange(e.target.value)}
                                onBlur={(e) => onResourceChange(e.target.value)}
                            >
                                {resourceNamesList.map(resourceName => <MenuItem key={`resource-${resourceName}`} value={resourceName}>{resourceName}</MenuItem>)}
                                <MenuItem key="resource-!" value="!">(new resource)</MenuItem>
                            </Select>
                            <FormHelperText>{resourceErrorMsg}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {showNewResource && <Grid item xs={12}>
                        <AddResourceForm 
                            resource={emptyResource}
                            onCancel={() => onNewResourceCancel()}
                            onCreate={onNewResourceCreate}
                            onSave={() => {}}
                        />
                    </Grid>}
                </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleClick}>{editing ? "Save" : "Create" }</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddApplyCommand;
